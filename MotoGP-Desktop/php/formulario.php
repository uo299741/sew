<?php

include '../cronometro.php';
include 'configuracion.php';

session_start();

$configuracion = new Configuracion();
if (!isset($_SESSION['miCrono'])) {
    $_SESSION['miCrono'] = new Cronometro();
}
$miCrono = $_SESSION['miCrono'];
$mostrarInicio = true;

if (isset($_POST['iniciar_prueba'])) {
    $mostrarEnviar = isset($_POST['iniciar_prueba']);
    $miCrono->arrancar();
}

$_SESSION['miCrono'] = $miCrono;

$mostrarEnviar = isset($_POST['iniciar_prueba']);
$mostrarCom = isset($_POST['enviar']);
$final = false;
$errorFormulario = false;
$error = "";
$formularioPOST = "";

if (isset($_POST['enviar'])) {
    if (!$errorFormulario){
        $mostrarInicio = false;
        $miCrono->parar();
        $formulario_id = $configuracion->insertarRespuestas($_POST['preguntaUno'], $_POST['preguntaDos'], $_POST['preguntaTres'], $_POST['preguntaCuatro'], $_POST['preguntaCinco'], $_POST['preguntaSeis'], $_POST['preguntaSiete'], $_POST['preguntaOcho'], $_POST['preguntaNueve'], $_POST['preguntaDiez']);
        $_SESSION['formulario_id'] = $formulario_id;
        $mostrarCom = isset($_POST['enviar']);
    } else{
        echo "<h4>Formulario NO PROCESADO en el servidor</h4>";
    }
}

if (isset($_POST['añadir'])) {
    $user_id = $configuracion->insertarUsuario($_POST['profesion'], $_POST['edad'], $_POST['genero'], $_POST['pericia_informatica']);
    $dispositivo_id = $configuracion->insertarDispositivo($_POST['dispositivo']);
    $formulario_id = $_SESSION['formulario_id'];
    $resultadoPrueba_id = $configuracion->insertarResultadosUsabilidad($user_id, $dispositivo_id, $formulario_id, $miCrono->getTiempo(), true, $_POST['comentarioPrueba'], $_POST['propuestaMejora'], $_POST['valoracion']);
    $configuracion->insertarObservacion($resultadoPrueba_id, $_POST['comentarioFacilitador']);
    $final = true;
    session_destroy();
}

if (count($_POST)>0) 
    {   
        $formularioPOST = $_POST;

        if(empty($_POST['preguntaUno'])){
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }

        if(empty($_POST['preguntaDos'])){
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }

        if (empty($_POST['preguntaTres'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        } 

        if (empty($_POST['preguntaCuatro'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }

        if (empty($_POST['preguntaCinco'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        } 

        if (empty($_POST['preguntaSeis'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        } 

        if (empty($_POST['preguntaSiete'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        } 

        if (empty($_POST['preguntaOcho'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }

        if (empty($_POST['preguntaNueve'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }

        if (empty($_POST['preguntaDiez'])) {
            $error = " El campo no puede estar vacío ";
            $errorFormulario = true;
        }
    }

echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8' />
        <title>Formulario</title>
        <link rel='stylesheet' type='text/css' href='/MotoGP-Desktop/estilo/estilo.css' />
        <link rel='stylesheet' type='text/css' href='/MotoGP-Desktop/estilo/layout.css' />      
    </head>
    <body>
    <main>
    <h1>Formulario</h1>
";

if ($mostrarInicio){
    echo "
        <form method='post'>
            <button type='submit' name='iniciar_prueba'>Iniciar prueba</button>
        </form>
        ";
}
if ($mostrarEnviar){
    echo "
            <form action='#' method='post' name='formulario'>
                <label for='preguntaUno'>¿En que equipo corre Jack Miller actualmente?</label>
                <input type='text' id='preguntaUno' name='preguntaUno' required/>
                <span>" . $error . "</span>

                <label for='preguntaDos'>¿En que equipo debutó Jack Miller en MotoGP?</label>
                <input type='radio' id='preguntaDos' name='preguntaDos' value='RZT Racing' checked/>RZT Racing
                <input type='radio' id='preguntaDos' name='preguntaDos' value='Caretta Technology' required/>Caretta Technology
                <input type='radio' id='preguntaDos' name='preguntaDos' value='Red Bull KTM Ajo'/>Red Bull KTM Ajo
                <span>" . $error . "</span>

                <label for='preguntaTres'>Selecciona el país de nacimiento de Jack Miller</label>
                    <select id='preguntaTres' name='preguntaTres'>
                        <option value='ES'>España</option>
                        <option value='CO'>Colombia</option>
                        <option value='PE'>Perú</option>
                        <option value='MX'>México</option>
                        <option value='AR'>Argentina</option>
                        <option value='AUS'>Australia</option>
                    </select>
                
                <label for='preguntaCuatro'>¿Cuantos puntos consiguió Jack Miller en 2024?</label>
                <input type='text' id='preguntaCuatro' name='preguntaCuatro' required/>
                <span>" . $error . "</span>

                <label for='preguntaCinco'>¿En que posición quedó Jack Miller en 2024?</label>
                <input type='text' id='preguntaCinco' name='preguntaCinco' required/>
                <span>" . $error . "</span>

                <label for='preguntaSeis'>¿Cuantas poles consiguió Jack Miller en 2024?</label>
                <input type='text' id='preguntaSeis' name='preguntaSeis' required/>
                <span>" . $error . "</span>

                <label for='preguntaSiete'>¿Cuantas victorias consiguió Jack Miller en 2024?</label>
                <input type='text' id='preguntaSiete' name='preguntaSiete' required/>
                <span>" . $error . "</span>

                <label for='preguntaOcho'>¿Cuantos podios consiguió Jack Miller en 2024?</label>
                <input type='text' id='preguntaOcho' name='preguntaOcho' required/>
                <span>" . $error . "</span>
                
                <label for='preguntaNueve'>¿Cuantos kg pesa Jack Miller?</label>
                <input type='text' id='preguntaNueve' name='preguntaNueve' required/>
                <span>" . $error . "</span>
                
                <label for='preguntaDiez'>¿Qué dorsal lleva Jack Miller?</label>
                <input type='text' id='preguntaDiez' name='preguntaDiez' required/>
                <span>" . $error . "</span>
                
                <button type='submit' name='enviar'>Terminar prueba</button>
            </form>
        ";
    }

if ($mostrarCom) {
echo "
    <form method='post'>
        <h2>Comentarios facilitador</h2>
        <textarea name='comentarioFacilitador' rows='5' cols='40'>
        </textarea>

        <h2>Datos personales</h2>
        <label for='profesion'>¿Cuál es su profesión?</label>
        <input type='text' id='profesion' name='profesion' required/>
        <span>" . $error . "</span>

        <label for='edad'>¿Cuál es su edad?</label>
        <input type='number' id='edad' name='edad' required/>
        <span>" . $error . "</span>

        <label for='genero'>¿Cuál es su género?</label>
        <input type='radio' id='genero' name='genero' value='Hombre' checked/>Hombre
        <input type='radio' id='genero' name='genero' value='Mujer' required/>Mujer
        <input type='radio' id='genero' name='genero' value='Otro'/>Otro
        <span>" . $error . "</span>

        <label for='pericia_informatica'>¿Cuál es su pericia informatica?</label>
            <select id='pericia_informatica' name='pericia_informatica'>
                <option value='Alta'>Alta</option>
                <option value='Media'>Media</option>
                <option value='Baja'>Baja</option>
            </select></p>

        <h2>Datos Test</h2>
        <label for='dispositivo'>¿Desde que dispositivo se encuentra?</label>
            <select id='dispositivo' name='dispositivo'>
                <option value='ordenador'>Ordenador</option>
                <option value='tableta'>Tableta</option>
                <option value='teléfono'>Teléfono</option>
            </select></p>

        <p>Comentario sobre la prueba</p>
        <textarea name='comentarioPrueba' rows='5' cols='40'>
        </textarea>

        <p>Propuestas de mejora</p>
        <textarea name='propuestaMejora' rows='5' cols='40'>
        </textarea>

        <label for='valoracion'>Valore la prueba</label>
            <select id='valoracion' name='valoracion'>
                <option value='0'>0</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
                <option value='7'>7</option>
                <option value='8'>8</option>
                <option value='9'>9</option>
                <option value='10'>10</option>
            </select></p>

        <button type='submit' name='añadir'>Añadir</button>
    </form>
";
}

if ($final) {
echo "
    <p>Formulario completado correctamente. Puede cerrar la ventana y volver a la aplicación principal o repetir el formulario en el botón de iniciar prueba.</p>
";}

echo "
    </main>
    </body>
    </html>
";

