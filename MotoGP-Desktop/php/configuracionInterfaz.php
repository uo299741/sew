<?php

include 'Configuracion.php';
$config = new Configuracion();

echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>MotoGP-Configuración</title>
        <link rel='stylesheet' type='text/css' href='../estilo/estilo.css' />
        <link rel='stylesheet' type='text/css' href='../estilo/layout.css' />
    </head>
    <body>

    <h1>Menú de configuración</h1>
    <h2>Crear base de datos</h2>
    <form method='post'>
        <button type='submit' name='crear'>Crear base de datos</button>
        <button type='submit' name='eliminar'>Eliminar base de datos</button>
        <button type='submit' name='exportar'>Exportar base de datos</button>
    </form>

    </body>
    </html>
";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['crear'])) {
        $config->crearBaseDatos("UO299741_DB.sql");
        echo "<p>Base de datos creada.</p>";
    }

    if (isset($_POST['eliminar'])) {
        $config->eliminarBaseDatos();
        echo "<p>Base de datos eliminada.</p>";
    }

    if (isset($_POST['exportar'])) {
        if ($config->exportarCSV()){
            echo "<p>Base de datos exportada</p>";
        } else{
            echo "<p>No se ha podido exportar</p>";
        }
    }

}