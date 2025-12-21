<?php

include 'configuracion.php';
$config = new Configuracion();

echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>MotoGP-Configuración</title>
        <link rel='stylesheet' type='text/css' href='/MotoGP-Desktop/estilo/estilo.css' />
        <link rel='stylesheet' type='text/css' href='/MotoGP-Desktop/estilo/layout.css' />
    </head>
    <body>
    <main>
    <h1>Menú de configuración</h1>
    <h2>Crear base de datos</h2>
    <form method='post'>
        <button type='submit' name='crear'>Crear base de datos</button>
        <button type='submit' name='eliminar'>Eliminar base de datos</button>
        <button type='submit' name='exportar'>Exportar base de datos</button>
    </form>
    </main>
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
        $config->exportarCSV();
    }

    if (isset($_POST['importar'])) {
        if ($config->importarCSV());
        echo "<p>Base de datos importada</p>";
    }

}