CREATE DATABASE IF NOT EXISTS UO299741_DB;
USE UO299741_DB;

Create table IF NOT EXISTS Usuario (
    usuario_id int AUTO_INCREMENT PRIMARY KEY,
    profesion VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    genero VARCHAR(100) NOT NULL,
    pericia_informatica VARCHAR(100) NOT NULL
);

Create table IF NOT EXISTS Dispositivo (
    dispositivo_id INT AUTO_INCREMENT PRIMARY KEY,
	tipo VARCHAR(50) CHECK (tipo IN ('ordenador','tableta','teléfono'))
);

Create table IF NOT EXISTS Formulario (
	formulario_id int AUTO_INCREMENT Primary Key,
    respuesta_uno Varchar(100) NOT NULL,
	respuesta_dos Varchar(100) NOT NULL,
    respuesta_tres Varchar(100) NOT NULL,
    respuesta_cuatro Varchar(100) NOT NULL,
    respuesta_cinco Varchar(100) NOT NULL,
    respuesta_seis Varchar(100) NOT NULL,
    respuesta_siete Varchar(100) NOT NULL,
    respuesta_ocho Varchar(100) NOT NULL,
    respuesta_nueve Varchar(100) NOT NULL,
    respuesta_diez Varchar(100) NOT NULL
);

Create table IF NOT EXISTS ResultadosUsabilidad (
    resultado_usabilidad_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id int NOT NULL,
	dispositivo_id INT NOT NULL,
	formulario_id int NOT NULL,
	tiempo_tardado Varchar(100) NOT NULL,
    tarea_completada Boolean NOT NULL,
	comentarios Varchar(100) NOT NULL,
	propuestas_mejora Varchar(100) NOT NULL,
	valoracion Int CHECK (valoracion BETWEEN 0 AND 10),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id),
	FOREIGN KEY (dispositivo_id) REFERENCES Dispositivo(dispositivo_id),
	FOREIGN KEY (formulario_id) REFERENCES Formulario(formulario_id)
);

Create table IF NOT EXISTS ObservacionesFacilitador (
    observacion_id int AUTO_INCREMENT PRIMARY KEY,
	resultado_usabilidad_id INT NOT NULL,
    comentarios Varchar(100) NOT NULL,
    FOREIGN KEY (resultado_usabilidad_id) REFERENCES ResultadosUsabilidad(resultado_usabilidad_id)
);

