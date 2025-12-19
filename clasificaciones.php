<?php

class Clasificacion {
    private $documento;
	private $xml;

    public function __construct() {
        $this->documento = "xml/circuitoEsquema.xml";
    }
	
	public function consultar() {
        $datos = file_get_contents($this->documento);
        $datos = preg_replace("/>\s*</", ">\n<", $datos);
 		$this->xml = new SimpleXMLElement($datos);
    }
    
	public function vencedor() {
        $nombre = (string)$this->xml->vencedor->nombre;
        $tiempo = $this->xml->vencedor->tiempo;

        $minutos = (int)$tiempo['minutos'];
        $segundos = (int)$tiempo['segundos'];
        $decimas = (int)$tiempo['decimas'];

        $tiempoString = sprintf("%02d:%02d.%03d", $minutos, $segundos, $decimas);

        return "<h3>Vencedor</h3>
                <p>Nombre: $nombre</p>
                <p>Tiempo: $tiempoString</p>";
    }

	public function clasificacionMundial() {
		$resultado = "<h3>Clasificación del Mundial</h3>";
		$resultado = $resultado . "<ul>";

		foreach ($this->xml->primerosClasificados->clasificado as $clasific) {
			$nombre = (string)$clasific->nombre;
			$puesto = (string)$clasific->puesto;
			$resultado = $resultado . "<li>Puesto $puesto: $nombre</li>";
		}

		$resultado = $resultado . "</ul>";
		return $resultado;
	}

}

$resultado = "Sin datos";
$clasificacionMundial = "Sin datos";
$clasificacion = new Clasificacion();
$clasificacion->consultar();
$resultado = $clasificacion->vencedor();
$clasificacionMundial = $clasificacion->clasificacionMundial();


echo "
	<!DOCTYPE HTML>

		<html lang='es'>
		<head>
			<!-- Datos que describen el documento -->
			<meta charset='UTF-8' />
			<title>MotoGP-Clasificaciones</title>
			<link rel='icon' href='multimedia/favicon.ico'>
			<meta name='author' content = 'Sergio Argüelles Huerta' />
			<meta name ='description' content ='Clasificaciones del mundial MotoGP de 2025' />
			<meta name ='keywords' content ='Clasificaciones' />
			<meta name ='viewport' content ='width=device-width, initial-scale=1.0' />
			<link rel='stylesheet' type='text/css' href='estilo/estilo.css' />
			<link rel='stylesheet' type='text/css' href='estilo/layout.css' />
		</head>

		<body>
			<!-- Datos con el contenidos que aparece en el navegador -->
			<header>
				<h1><a href='index.html' title='Inicio'>MotoGP Desktop</a></h1>
				<nav>
					<a href='index.html' title='Página inicial'>Inicio</a>
					<a href='piloto.html' title='Información del piloto'>Piloto</a>
					<a href='circuito.html' title='Circuitos de MotoGP'>Circuito</a>
					<a href='meteorologia.html' title='Meteorología prevista'>Meteorología</a>
					<a href='clasificaciones.php' title='Clasificaciones de MotoGP' class='active'>Clasificaciones</a>
					<a href='juegos.html' title='Juegos de MotoGP'>Juegos</a>
					<a href='ayuda.html' title='Ayuda de MotoGP-Desktop'>Ayuda</a>
				</nav>
			</header>
			<p>Estás en: <a href='index.html'>Inicio</a> >> <strong>Clasificaciones</strong></p>
			<main>
			<h2>Clasificaciones</h2>
			$resultado
			$clasificacionMundial
			</main>
		</body>
		</html>
	";