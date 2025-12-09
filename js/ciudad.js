"use strict";
class Ciudad {
    #nombreCiudad;
    #pais;
    #gentilicio;
    #cantidadPoblacion;
    #coordenadas;

    constructor (nombreCiudad, pais, gentilicio){
        this.#nombreCiudad = nombreCiudad;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#cantidadPoblacion = 0;
        this.#coordenadas = { latitud: 0, longitud: 0 };
    }

    rellenarRestantes(cantidadPoblacion, coordenadas) {
        this.#cantidadPoblacion = cantidadPoblacion;
        this.#coordenadas = coordenadas;
    }

    getNombreCiudad() {
        return this.#nombreCiudad;
    }

    getPais() {
        return this.#pais;
    }

    getInfoSecCiudad() {
        return (
            "<ul>" +
                "<li><strong>Gentilicio:</strong> " + this.#gentilicio + "</li>" +
                "<li><strong>Población:</strong> " + this.#cantidadPoblacion + " habitantes</li>" +
            "</ul>"
        );
    }

    escribirCoordenadas() {
        const parrafo = document.createElement("p");
        parrafo.innerHTML = `<strong>Coordenadas:</strong> Latitud: ${this.#coordenadas.latitud}, Longitud: ${this.#coordenadas.longitud}`;
        return parrafo;
    }

    getMeteorologiaCarrera() {
        const fechaCarrera = "2024-08-24";
        const url = "https://archive-api.open-meteo.com/v1/archive?latitude=" + this.#coordenadas.latitud + "&longitude=" + this.#coordenadas.longitud + "&start_date=" + fechaCarrera + "&end_date=" + fechaCarrera + "&hourly=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&timezone=auto";

        return $.getJSON(url)
        .done((data) => {
            this.procesarJSONCarrera(data);
        })
    }

    procesarJSONCarrera(data){
        const salidaSol = data.daily.sunrise[0];
        const puestaSol = data.daily.sunset[0];

        const horaBuscada = "2024-08-24T12:00"; 
        const hora = data.hourly.time.indexOf(horaBuscada);

        const temperatura = data.hourly.temperature_2m[hora];
        const sensacion = data.hourly.apparent_temperature[hora];
        const humedad = data.hourly.relative_humidity_2m[hora];
        const lluvia = data.hourly.precipitation[hora];
        const vientoVel = data.hourly.windspeed_10m[hora];
        const vientoDir = data.hourly.winddirection_10m[hora];

        const article = $("<article></article>");
        article.append($("<h2></h2>").text("Meteorología de la carrera"));
        article.append($("<p></p>").text("Hora: 12:00"));
        article.append($("<p></p>").text(`Temperatura: ${temperatura} °C`));
        article.append($("<p></p>").text(`Sensación térmica: ${sensacion} °C`));
        article.append($("<p></p>").text(`Lluvia: ${lluvia} mm`));
        article.append($("<p></p>").text(`Humedad: ${humedad} %`));
        article.append($("<p></p>").text(`Velocidad del viento: ${vientoVel} km/h`));
        article.append($("<p></p>").text(`Dirección del viento: ${vientoDir}°`));
        article.append($("<p></p>").text(`Amanece: ${salidaSol}`));
        article.append($("<p></p>").text(`Atardece: ${puestaSol}`));

        document.querySelector("[data-meteo]").append(article[0]);
    }

    getMeteorologiaEntrenos() {
        const fechaInicio = "2024-08-21";
        const fechaFin = "2024-08-23";
        const url = "https://archive-api.open-meteo.com/v1/archive?latitude=" + this.#coordenadas.latitud + "&longitude=" + this.#coordenadas.longitud + "&start_date=" + fechaInicio + "&end_date=" + fechaFin + "&hourly=temperature_2m,precipitation,relative_humidity_2m,windspeed_10m&daily=sunrise,sunset&timezone=auto";

        return $.getJSON(url)
            .done((data) => {
                this.procesarJSONEntrenos(data);
            })
    }
        
    procesarJSONEntrenos(data){
        const dias = data.daily.time;

        const article = $("<article></article>");
        article.append($("<h2></h2>").text("Medias meteorológicas de los entrenamientos"));

        for(let d = 0; d < dias.length; d++){
            const dia = dias[d];

            let sumaTemp = 0, sumaLluvia = 0, sumaHumedad = 0, sumaViento = 0;
            let contador = 0;

            for(let h = 0; h < data.hourly.time.length; h++){
                if(data.hourly.time[h].startsWith(dia)){
                    sumaTemp += data.hourly.temperature_2m[h];
                    sumaLluvia += data.hourly.precipitation[h];
                    sumaHumedad += data.hourly.relative_humidity_2m[h];
                    sumaViento += data.hourly.windspeed_10m[h];
                    contador++;
                }
            }

            const mediaTemp = +(sumaTemp / contador).toFixed(2);
            const mediaLluvia = +(sumaLluvia / contador).toFixed(2);
            const mediaHumedad = +(sumaHumedad / contador).toFixed(2);
            const mediaViento = +(sumaViento / contador).toFixed(2);

            article.append($("<p></p>").text(`Día: ${dia}`));
            article.append($("<p></p>").text(`Temperatura media: ${mediaTemp} °C`));
            article.append($("<p></p>").text(`Lluvia media: ${mediaLluvia} mm`));
            article.append($("<p></p>").text(`Humedad media: ${mediaHumedad} %`));
            article.append($("<p></p>").text(`Velocidad media del viento: ${mediaViento} km/h`));
            article.append($("<hr>"));
        }

        document.querySelector("[data-meteoEntrenos]").append(article[0]);
    }
}

$(document).ready(function() {
    const circuitCity = new Ciudad("Balaton", "Hungría", "Húngaro");
    circuitCity.rellenarRestantes(1000, { latitud: 47.0170833, longitud: 18.212111 });

    const infoCiudad = document.querySelector("[data-infoCiudad]");

    infoCiudad.innerHTML += `<h2>${circuitCity.getNombreCiudad()}</h2>`;
    infoCiudad.innerHTML += `<p><strong>País:</strong> ${circuitCity.getPais()}</p>`;
    infoCiudad.innerHTML += circuitCity.getInfoSecCiudad();
    infoCiudad.appendChild(circuitCity.escribirCoordenadas());

    circuitCity.getMeteorologiaCarrera();

    circuitCity.getMeteorologiaEntrenos();

});

