"use strict";

class Noticias {
    #busqueda;
    #url;

    constructor(busqueda) {
        this.#busqueda = busqueda; 
        this.#url = "https://api.thenewsapi.com/v1/news/all?";
    }

    async buscar(idioma = "es", pageSize = 5) {
        const apiKey = "Yt8ehZwjcu6aMywaUIqBqYqnwPoMGrUIofoG0bfO";
        const urlCompleta = this.#url
            + "api_token=" + apiKey
            + "&search=" + encodeURIComponent(this.#busqueda)
            + "&language=" + idioma
            + "&page_size=" + pageSize;

        try {
            const respuesta = await fetch(urlCompleta);
            if (!respuesta.ok) throw new Error("HTTP error! status: " + respuesta.status);

            const datos = await respuesta.json();
            this.procesarInformacion(datos);
        } catch (error) {
            console.error("Error al buscar noticias:", error);
        }
    }

    procesarInformacion(datosJSON) {
        const seccion = document.createElement("section");
        seccion.innerHTML = "";
        
        const palabraClave = "MotoGP";
        const hh = document.createElement("h2");
        hh.textContent = "Listado de noticias";
        seccion.appendChild(hh);

        datosJSON.data.forEach(noticia => {

            if ((noticia.title && noticia.title.includes(palabraClave)) || 
            (noticia.description && noticia.description.includes(palabraClave))) {
                const articulo = document.createElement("article");
                articulo.classList.add("noticia");

                const h3 = document.createElement("h3");
                h3.textContent = noticia.title;
                articulo.appendChild(h3);

                const pDesc = document.createElement("p");
                pDesc.textContent = noticia.description;
                articulo.appendChild(pDesc);

                const pFuente = document.createElement("p");
                pFuente.innerHTML = `<strong>Fuente:</strong> ${noticia.source}`;
                articulo.appendChild(pFuente);

                const enlace = document.createElement("a");
                enlace.href = noticia.url;
                enlace.target = "_blank";
                enlace.textContent = "Leer más";
                articulo.appendChild(enlace);

                seccion.appendChild(articulo);
            }
        });

        document.querySelector("main").appendChild(seccion);

    }



}

$(document).ready(function() {
    const busqueda = "MotoGP";

    const notis = new Noticias(busqueda);

    notis.buscar();
});