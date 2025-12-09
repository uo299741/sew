"use strict";
class Circuito {

    constructor (){
        this.#comprobarApiFile();
        this.#inicializarLectura();
    }

    #comprobarApiFile(){
        const text = document.querySelector("[data-soportaApi]");

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            text.innerHTML = "<p>Este navegador soporta el API File </p>";

        } else {
            text.innerHTML = "<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>";
        }
    }

    #inicializarLectura() {
        const input = document.querySelector("[data-archivo]");
        input.addEventListener("change", (e) => this.#leerArchivoHTML(e.target.files));
    }

    #leerArchivoHTML(files){

        const archivo = files[0];
        const errorArchivo = document.querySelector("[data-errorlectura]");

        const tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = function (evento) {
                const todo = lector.result;
                const area = document.querySelector("[data-area]");
                area.innerHTML = todo;

                const parser = new DOMParser();
                const doc = parser.parseFromString(todo, "text/html");

                doc.querySelectorAll("img").forEach(img => {
                    const nombreArchivo = img.getAttribute("src").split("/").pop();
                    img.src = "multimedia/" + nombreArchivo; 
                });


                const cont = document.querySelector("[data-area]");
                cont.innerHTML = doc.body.innerHTML;


            }      
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error";
        }
  };
        
}

class CargadorSVG {

    constructor() {
        this.#inicializar();
    } 

    #inicializar() {
        const input = document.querySelector("[data-archivoSVG]");
        input.addEventListener("change", (e) => this.#leerArchivoSVG(e));
    }

    #leerArchivoSVG(evento) {
        const archivo = evento.target.files[0];

        if (archivo && archivo.type === 'image/svg+xml') {
            const lector = new FileReader();
            lector.onload = (e) => this.#insertarSVG(e.target.result);
            lector.readAsText(archivo);
        } else {
            alert('Selecciona un archivo SVG válido.');
        }
    }

    #insertarSVG(contenidoTexto) {
        const parser = new DOMParser();
        const documentoSVG = parser.parseFromString(contenidoTexto, 'image/svg+xml');
        const elementoSVG = documentoSVG.documentElement;
        const contenedor = document.querySelector("[data-areaSVG]");
        contenedor.innerHTML = '';
        contenedor.appendChild(elementoSVG);
    }
}

class CargadorKML {

    constructor() {
        this.#inicializar();
    } 

    #inicializar() {
        const input = document.querySelector("[data-archivoKML]");
        input.addEventListener("change", (e) => this.#leerArchivoKML(e));
    }

    #leerArchivoKML(evento) {
        const archivo = evento.target.files[0];

        if (archivo.type === "application/vnd.google-earth.kml+xml" || archivo.name.endsWith(".kml")) {
            const lector = new FileReader();
            lector.onload = (e) => this.#insertarKML(e.target.result);
            lector.readAsText(archivo);
        } else {
            alert('Selecciona un archivo KML válido.');
        }
    }

    #insertarKML(contenidoTexto) {
        
        if (!this.map) {
            const mapa = document.querySelector("[data-map]");
            this.map = new google.maps.Map(mapa, {
                mapTypeId: "roadmap"
            });
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(contenidoTexto, "text/xml");

        const coordText = xml.querySelector("coordinates").textContent.trim();
        const lineas = coordText.split("\n");
        const coords = [];

        for (let linea of lineas) {
            linea = linea.trim();
            const partes = linea.split(",");
            const lng = parseFloat(partes[0]);
            const lat = parseFloat(partes[1]);
            coords.push({ lat: lat, lng: lng });
        }

        new google.maps.Marker({
            position: coords[0],
            map: this.map,
        });

        const poly = new google.maps.Polyline({
            path: coords,
            map: this.map,
        });

        const bounds = new google.maps.LatLngBounds();
        coords.forEach(p => bounds.extend(p));
        this.map.fitBounds(bounds);
    }
}

$(document).ready(function() {
    const circuito = new Circuito();
    const cargadorSvg = new CargadorSVG();
    //const cargadorKml = new CargadorKML();

});

document.addEventListener("DOMContentLoaded", () => {
    const cargadorKml = new CargadorKML();
});

