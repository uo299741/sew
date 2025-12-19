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
        this.img = null;

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

        const article = document.createElement("article");
        
        const h2 = document.createElement("h2");
        h2.innerHTML = `Imágenes del circuito de ${this.#busqueda}`;
        
        this.img = document.createElement("img");
        this.img.src = primeraFoto.url;
        this.img.alt = primeraFoto.titulo;
        
        article.appendChild(h2);
        article.appendChild(this.img);
        
        const info = document.querySelector("main p");
        document.querySelector("main").appendChild(article);
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
        this.img.src = foto.url;
        this.img.alt = foto.titulo;
    }
}

$(document).ready(function() {
    const circuito = "Balaton Park";

    const carrusel = new Carrusel(circuito);

    carrusel.getFotografias().then(() => {
        carrusel.mostrarFotografias();
    });
});