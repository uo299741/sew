<?php

class Configuracion {
    private $serverName = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $db_Name = "UO299741_DB";
    private $db;

    public function __construct() {
        $this->iniciarBaseDatos();
        $this->crearBaseDatos("UO299741_DB.sql");
    }

    public function iniciarBaseDatos() {
        $this->db = new mysqli($this->serverName, $this->username, $this->password);
        if ($this->db->connect_error) {
            exit("Error de conexión: " . $this->db->connect_error);
        }
    }

    public function crearBaseDatos($archivoSQL) {
        $this->db = new mysqli($this->serverName, $this->username, $this->password);
        if ($this->db->connect_error) {
            exit("Error de conexión: " . $this->db->connect_error);
        }

        $sql = file_get_contents($archivoSQL);
        $sentencias = explode(';', $sql);

        foreach ($sentencias as $sentencia) {
            $sentencia = trim($sentencia);
            if (!empty($sentencia)) {
                if (!$this->db->query($sentencia)) {
                    echo "Error al crear la base de datos";
                }
            }
        }
        $this->db = new mysqli($this->serverName, $this->username, $this->password, $this->db_Name);
        if ($this->db->connect_error) {
            exit("Error de conexión: " . $this->db->connect_error);
        }
    }

    public function eliminarBaseDatos() {
        $consulta = "DROP DATABASE IF EXISTS " . $this->db_Name;
        $this->db->query($consulta);
    }

    public function reiniciarBD() {
        $this->eliminarBaseDatos();
        $this->crearBaseDatos("UO299741_DB.sql");
        $this->iniciarBaseDatos();
    }

    public function exportarCSV() {
        if (!$this->comprobarExisteBaseDatos()){
            echo "<p>Debes de crear la base de datos para poder exportar</p>";
            return false;
        }

        $this->db = new mysqli($this->serverName, $this->username, $this->password, $this->db_Name);
        if ($this->db->connect_error) {
            exit("Error de conexión: " . $this->db->connect_error);
        }

        $archivo = fopen("datos.csv", "w");
        $nombresTablas = ['Usuario', 'Dispositivo', 'ResultadosUsabilidad', 'ObservacionesFacilitador', 'Formulario'];

        foreach ($nombresTablas as $tabla) {
            $resultado = $this->db->query("SELECT * FROM $tabla");
            if ($resultado->num_rows > 0) {
                $campos = $resultado->fetch_fields();
                $titulos = ['tabla'];
                foreach ($campos as $campo) {
                    $titulos[] = $campo->name;
                }
                fputcsv($archivo, $titulos);

                while ($row = $resultado->fetch_assoc()) {
                    $fila = [$tabla];
                    foreach ($row as $valor) {
                        $fila[] = $valor;
                    }
                    fputcsv($archivo, $fila);
                }

                fputcsv($archivo, []);
            }
        }

        fclose($archivo);
        return true;
    }

    public function importarCSV() {
        if (!$this->comprobarExisteBaseDatos()){
            echo "<p>Debes de crear la base de datos para poder exportar</p>";
            return false;
        }
        $this->reiniciarBD();

        $this->db = new mysqli($this->serverName, $this->username, $this->password, $this->db_Name);
        if ($this->db->connect_error) {
            exit("Error de conexión: " . $this->db->connect_error);
        }
        $this->db->query("SET FOREIGN_KEY_CHECKS=0");

        $archivo = fopen("datos.csv", "r");
        $titulos = fgetcsv($archivo);
         while (($fila = fgetcsv($archivo)) !== false) {
            if (empty($fila[0])) continue;
            if (strtolower($fila[0]) == 'tabla') {
                $titulos = $fila; 
                continue;
            }
            $tabla = $fila[0];

            $columnas = [];
            for ($i = 1; $i < count($titulos); $i++) {
                $columnas[] = $titulos[$i];
            }

            $valores = [];
            for ($i = 1; $i < count($fila); $i++) {
                $valores[] = $fila[$i];
            }

            $columnas_str = implode(",", $columnas);
            $valores_str  = "'" . implode("','", $valores) . "'";

            $query = "INSERT INTO $tabla ($columnas_str) VALUES ($valores_str)";
            $this->db->query($query);
        }
        $this->db->query("SET FOREIGN_KEY_CHECKS=1");
        fclose($archivo);
        return true;
    }

    public function comprobarExisteBaseDatos() {
        $db = new mysqli($this->serverName, $this->username, $this->password);
        if ($db->connect_error) {
            exit("Error de conexión: " . $db->connect_error);
        }

        $baseDatos = $db->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '".$this->db_Name ."'");

        if ($baseDatos->num_rows == 0) {
            $db->close();
            return false;
        }

        $db->close();
        return true;
    }

    public function insertarUsuario($profesion, $edad, $genero, $pericia_informatica) {
        $query = $this->db->prepare("INSERT INTO Usuario (profesion, edad, genero, pericia_informatica) VALUES (?, ?, ?, ?)");
        $query->bind_param("siss", $profesion, $edad, $genero, $pericia_informatica);
        $query->execute();
        return $this->db->insert_id;
    }

    public function insertarDispositivo($tipo) {
        $query = $this->db->prepare("INSERT INTO Dispositivo (tipo) VALUES (?)");
        $query->bind_param("s", $tipo);
        $query->execute();
        return $this->db->insert_id;
    }

    public function insertarResultadosUsabilidad($usuario_id, $dispositivo_id, $formulario_id, $tiempo_tardado, $tarea_completada, $comentarios, $propuestas_mejora, $valoracion
    ) {
        $query = $this->db->prepare("INSERT INTO ResultadosUsabilidad (usuario_id, dispositivo_id, formulario_id, tiempo_tardado, tarea_completada, comentarios, propuestas_mejora, valoracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("iiissssi", $usuario_id, $dispositivo_id, $formulario_id, $tiempo_tardado, $tarea_completada, $comentarios, $propuestas_mejora, $valoracion);
        $query->execute();
        return $this->db->insert_id;
    }

    public function insertarObservacion($resultado_usabilidad_id, $comentarios) {
        $query = $this->db->prepare("INSERT INTO ObservacionesFacilitador (resultado_usabilidad_id, comentarios) VALUES (?, ?)");
        $query->bind_param("is", $resultado_usabilidad_id, $comentarios);
        $query->execute();
    }

    public function insertarRespuestas($respuesta_uno, $respuesta_dos, $respuesta_tres, $respuesta_cuatro, $respuesta_cinco, $respuesta_seis, $respuesta_siete, $respuesta_ocho, $respuesta_nueve, $respuesta_diez) {
        $query = $this->db->prepare("INSERT INTO Formulario (respuesta_uno, respuesta_dos, respuesta_tres, respuesta_cuatro, respuesta_cinco, respuesta_seis, respuesta_siete, respuesta_ocho, respuesta_nueve, respuesta_diez) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssssssss", $respuesta_uno, $respuesta_dos, $respuesta_tres, $respuesta_cuatro, $respuesta_cinco, $respuesta_seis, $respuesta_siete, $respuesta_ocho, $respuesta_nueve, $respuesta_diez);
        $query->execute();
        return $this->db->insert_id;
    }

}