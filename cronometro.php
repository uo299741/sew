<?php

class Cronometro {
    private $tiempo;
    private $inicio;

    public function __construct() {
        $this->inicio = null;
        $this->tiempo = 0;
    }

    public function arrancar() {
        $this->tiempo = 0;
        $this->inicio = microtime(true);
    }

    public function parar() {
        if ($this->inicio !== null) {
            $this->tiempo += (microtime(true) - $this->inicio) * 1000;
            $this->inicio = null;
        }
    }

    public function mostrar(){
        $actual = $this->tiempo;
        $totalSegundos = $actual / 1000;
        $minutos = floor($totalSegundos / 60);
        $segundos = fmod($totalSegundos, 60);

        $tiempoString = sprintf("%02d:%04.1f", $minutos, $segundos);

        return "<p>Tiempo = $tiempoString</p>";
    }

    public function getTiempo(){
        $actual = $this->tiempo;
        $totalSegundos = $actual / 1000;
        $minutos = floor($totalSegundos / 60);
        $segundos = fmod($totalSegundos, 60);

        $tiempoString = sprintf("%02d:%04.1f", $minutos, $segundos);
        return $tiempoString;
    }
}
