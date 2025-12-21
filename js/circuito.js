"use strict";
class Circuito {

    constructor (){
        this.#comprobarApiFile();
        this.#inicializarLectura();
    }

    #comprobarApiFile(){
        const text = document.querySelector("main p");

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            text.textContent  = "Este navegador soporta el API File";

        } else {
            text.textContent  = "Este navegador no soporta el API File";
        }
    }

    #inicializarLectura() {
        const inputs = document.querySelectorAll("input");
        const input = inputs[0];
        input.addEventListener("change", (e) => this.#leerArchivoHTML(e.target.files));
    }

    #leerArchivoHTML(files){
        
        const archivo = files[0];
        const errorArchivo = document.createElement("p");


        const tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = function (evento) {
                const todo = lector.result;
                const area = document.createElement("section");
                area.innerHTML = todo;

                const parser = new DOMParser();
                const doc = parser.parseFromString(todo, "text/html");

                doc.querySelectorAll("img").forEach(img => {
                    const nombreArchivo = img.getAttribute("src").split("/").pop();
                    img.src = "multimedia/" + nombreArchivo; 
                });

                area.innerHTML = doc.body.innerHTML;

                const inputs = document.querySelectorAll("input");
                const input = inputs[0];
                input.insertAdjacentElement("afterend", area);
            }      
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error";
            document.querySelector("main").appendChild(errorArchivo);
        }
  };
        
}

class CargadorSVG {

    constructor() {
        this.#inicializar();
    } 

    #inicializar() {
        const inputs = document.querySelectorAll("input");
        const input = inputs[1];
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
        const contenedor = document.createElement("section");
        contenedor.innerHTML = '';
        const h2 = document.createElement("h2");
        h2.innerHTML = 'Altimetría';
        contenedor.appendChild(h2);
        contenedor.appendChild(elementoSVG);

        const inputs = document.querySelectorAll("input");
        const input = inputs[1];
        input.insertAdjacentElement("afterend", contenedor);
    }
}

class CargadorKML {

    constructor() {
        this.#inicializar();
    } 

    #inicializar() {
        const inputs = document.querySelectorAll("input");
        const input = inputs[2];
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
            const mapa = document.querySelector("div");
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

        document.querySelector("main").appendChild(mapa);    

    }
}

$(document).ready(function() {
    const circuito = new Circuito();
    const cargadorSvg = new CargadorSVG();

});

document.addEventListener("DOMContentLoaded", () => {
    const cargadorKml = new CargadorKML();
});

