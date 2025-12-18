class Memoria {

    #tablero_bloqueado = true;
    #primera_carta = null;
    #segunda_carta = null;
    #cartas = [];
    #Cronometro;

	constructor(Cronometro) {
		this.#tablero_bloqueado = true;
		this.#primera_carta = null;
		this.#segunda_carta = null;
		
		this.#cartas = Array.from(document.querySelectorAll("main article"));

		this.#barajarCartas();
		this.#tablero_bloqueado = false;

		this.#asignCarts();

		this.#Cronometro = Cronometro;
        this.#Cronometro.arrancar();	
	}
	
	voltearCarta(carta) {
		if (this.#tablero_bloqueado || carta.dataset.estado === "volteada" || carta.dataset.estado === "revelada") {
			return;
		}

		carta.dataset.estado = "volteada";
		
		if (!this.#primera_carta) {
			this.#primera_carta = carta;
			return;
		}
		
		this.#segunda_carta = carta;
				
		this.#comprobarPareja();
	}
	
	#barajarCartas() {
		const contenedor = document.querySelector("main");
		const cartas = contenedor.querySelectorAll("article");
		const cartasArray = Array.from(cartas);
		
		for (let i = 0; i < cartasArray.length; i++) {
			const j = Math.floor(Math.random() * cartasArray.length);
			[cartasArray[i], cartasArray[j]] = [cartasArray[j], cartasArray[i]];
		}
		cartasArray.forEach(carta => contenedor.appendChild(carta));
	}
	
	#reiniciarAtributos(){
		this.#tablero_bloqueado = false;
		this.#primera_carta = null;
		this.#segunda_carta = null;
	}
	
	#deshabilitarCartas(){
		this.#primera_carta.dataset.estado = "revelada";
		this.#segunda_carta.dataset.estado = "revelada";
		this.#reiniciarAtributos();
		this.#comprobarJuego();
	}
	
	#comprobarJuego(){
		const cartas = document.querySelectorAll("main article");
		const reveladas = document.querySelectorAll("main article[data-estado='revelada']");
		
		if (cartas.length === reveladas.length) {
			this.#tablero_bloqueado = true;
			this.#Cronometro.parar();	
		} else{
			this.#tablero_bloqueado = false;
		}

	}
	
	#cubrirCartas(){
		this.#tablero_bloqueado = true;
		setTimeout(() => {
			this.#primera_carta.removeAttribute("data-estado");
			this.#segunda_carta.removeAttribute("data-estado");
			this.#reiniciarAtributos();
		}, 1500);
	}
	
	#comprobarPareja(){
		const img1 = this.#primera_carta.children[1].getAttribute("src");
		const img2 = this.#segunda_carta.children[1].getAttribute("src");
		if (img1 === img2) {
			this.#deshabilitarCartas();
		} else {
			this.#cubrirCartas();
		}
	}

	#asignCarts() {
        this.#cartas.forEach(carta => {
            carta.addEventListener("click", () => this.voltearCarta(carta));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
	const crono = new Cronometro();
    const juegoMemoria = new Memoria(crono);
});
