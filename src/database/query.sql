CREATE DATABASE prueba_sistema;

USE prueba_sistema;

CREATE TABLE empleados(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    edad INT,
    fecha_creacion DATE NOT NULL)

SELECT * FROM empleados;