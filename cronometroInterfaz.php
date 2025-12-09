<?php
include 'Cronometro.php';

session_start();


if (!isset($_SESSION['miCrono'])) {
    $_SESSION['miCrono'] = new Cronometro();
}
$miCrono = $_SESSION['miCrono'];
$resultado = "No hay tiempo";
if (count($_POST)>0) 
    {   

        if(isset($_POST['botonArrancar'])) $miCrono->arrancar();
        if(isset($_POST['botonParar'])) $miCrono->parar();
        if(isset($_POST['botonMostrar'])) $resultado = $miCrono->mostrar();
        
    }

$_SESSION['miCrono'] = $miCrono;

echo "
       <!DOCTYPE HTML>

            <html lang='es'>
            <head>
                <!-- Datos que describen el documento -->
                <meta charset='UTF-8' />
                <title>MotoGP-Cronómetro-PHP</title>
                <link rel='icon' href='multimedia/favicon.ico'>
                <meta name='author' content = 'Sergio Argüelles Huerta' />
                <meta name ='description' content ='Cronómetro PHP' />
                <meta name ='keywords' content ='Cronómetro' />
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
                        <a href='clasificaciones.php' title='Clasificaciones de MotoGP'>Clasificaciones</a>
                        <a href='juegos.html' title='Juegos de MotoGP'>Juegos</a>
                        <a href='ayuda.html' title='Ayuda de MotoGP-Desktop' class='active'>Ayuda</a>
                    </nav>
                </header>
                <p>Estás en: <a href='index.html'>Inicio</a> >> <strong>Juegos-Cronómetro PHP</strong></p>
                <main>
                    <h3>Pulse un botón</h3>
                        <form action='#' method='post' name='botones'>
                            <div>
                                <input type = 'submit' class='button' name = 'botonArrancar' value = 'Arrancar'/>
                                <input type = 'submit' class='button' name = 'botonParar' value = 'Parar'/>
                                <input type = 'submit' class='button' name = 'botonMostrar' value = 'Mostrar'/>
                            </div>
                        </form>

                    $resultado

                </main>
            </body>
            </html>

";