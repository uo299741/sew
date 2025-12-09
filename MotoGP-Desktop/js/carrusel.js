"use strict";

class Carrusel {
    #busqueda;
    #actual = 0;
    #maximo = 4;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#actual = 0;
        this.#maximo = 4;
        this.fotos = [];

    }

    getFotografias() {
        return $.getJSON(
            "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
            { tags: this.#busqueda, format: "json" }
        )
        .done((data) => {
            this.procesarJSONFotografias(data);
        })
    }

    mostrarFotografias() {
        const primeraFoto = this.fotos[0];
        const aux = `
            <article>
                <h2>Imágenes del circuito de ${this.#busqueda}</h2>
                <img src="${primeraFoto.url}" alt="${primeraFoto.titulo}">
            </article>`;
        const info = document.querySelector("[data-info]");
        const fotos = document.querySelector("[data-fotos]");
        fotos.innerHTML = aux;
        info.textContent = "";

        setInterval(this.cambiarFotografia.bind(this), 3000);

    }

    procesarJSONFotografias(data) {
        this.fotos = data.items.slice(0, this.#maximo).map(item => ({
            titulo: item.title,
            url: item.media.m.replace("_m.", "_z.")
        }));
    }

    cambiarFotografia() {
        this.#actual = (this.#actual + 1) % this.#maximo;

        const foto = this.fotos[this.#actual];
        const fotos = document.querySelector("[data-fotos]");
        fotos.innerHTML = `
            <article>
                <h2>Imágenes del circuito de ${this.#busqueda}</h2>
                <img src="${foto.url}" alt="${foto.titulo}">
            </article>
        `;
    }
}

$(document).ready(function() {
    const circuito = "Balaton Park";
    const carrusel = new Carrusel(circuito);

    carrusel.getFotografias().then(() => {
        carrusel.mostrarFotografias();
    });
});