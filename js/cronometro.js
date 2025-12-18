class Cronometro {

    #tiempo = 0;
    #corriendo = null;
    #inicio;

    constructor (){ 
        this.#tiempo = 0;
    }
	
	arrancar(){
		try {
            if (typeof Temporal !== "undefined" && Temporal.Now) {
                this.#inicio = Temporal.Now.instant();
            } else {
                throw "El objeto Temporal no está disponible en este navegador.";
            }
        }
        catch(err) {
            this.#inicio = new Date();
            console.log("Error = " + err);
        }
        this.#corriendo = setInterval(this.#actualizar.bind(this), 100);
    }
	
	#actualizar(){
		let momentoActual;

        try {
            if (typeof Temporal !== "undefined" && Temporal.Now) {
                momentoActual = Temporal.Now.instant();
                this.#tiempo = momentoActual.epochMilliseconds - this.#inicio.epochMilliseconds;
            } else {
                throw "El objeto Temporal no está disponible";
            }
        } catch (err) {
            momentoActual = new Date();
            this.#tiempo = momentoActual - this.#inicio;
        }
		this.#mostrar();

    }
	
	#mostrar(){
		let totalDecimas = parseInt(this.#tiempo / 100);
        let decimas = totalDecimas % 10;

        let totalSegundos = parseInt(this.#tiempo / 1000);
        let segundos = totalSegundos % 60;

        let minutos = parseInt(totalSegundos / 60);


		if (minutos < 10){
			var stringMinutos = "0" + minutos;
		} else{
			var stringMinutos = minutos;
		}
		
		if (segundos < 10){
			var stringSegundos = "0" + segundos;
		} else{
			var stringSegundos = segundos;
		}
		
		var stringDecimas = decimas;


		var stringCronometro = stringMinutos + ":" + stringSegundos + "." + stringDecimas;

        const pantalla = document.querySelector("main p");

        pantalla.textContent = stringCronometro;
    }
	
	parar(){
		if (this.#corriendo) {
			clearInterval(this.#corriendo);
			this.#corriendo = null;
		}
    }
	
	reiniciar(){
		if (this.#corriendo) {
            clearInterval(this.#corriendo);
            this.#corriendo = null;
        }
		this.#tiempo = 0;
		this.#mostrar();
    }
			
}

document.addEventListener("DOMContentLoaded", () => {
    const crono = new Cronometro();

    const botones = document.querySelectorAll("main button");
    const btnArrancar = botones[0];
    const btnParar = botones[1];
    const btnReiniciar = botones[2];

    btnArrancar.addEventListener("click", () => crono.arrancar());
    btnParar.addEventListener("click", () => crono.parar());
    btnReiniciar.addEventListener("click", () => crono.reiniciar());

});