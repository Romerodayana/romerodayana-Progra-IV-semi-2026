CREATE DATABASE db_parque_vehicular_keyri;

USE db_parque_vehicular_keyri;

CREATE TABLE tbl_vehiculos(
    idVehiculo INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(25),
    modelo VARCHAR(25),
    year INT(4),
    num_motor CHAR(25),
    num_chasis CHAR(25)
);

parque_vehicular/

├── index.html
├── js/
│   └── app.js
├── css/
│   └── estilos.css
├── php/
│   ├── conexion.php
│   ├── guardar.php
│   └── listar.php

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Parque Vehicular</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<script src="https://unpkg.com/vue@3"></script>

</head>
<body>

<div class="container mt-5">

<h2 class="text-center">Registro de Vehículos</h2>

<div class="card p-4">

<form id="frmVehiculo">

<div class="mb-3">
<label>Marca</label>
<input type="text" id="marca" class="form-control">
</div>

<div class="mb-3">
<label>Modelo</label>
<input type="text" id="modelo" class="form-control">
</div>

<div class="mb-3">
<label>Año</label>
<input type="text" id="year" class="form-control">
</div>

<div class="mb-3">
<label>Número Motor</label>
<input type="text" id="motor" class="form-control">
</div>

<div class="mb-3">
<label>Número Chasis</label>
<input type="text" id="chasis" class="form-control">
</div>

<button type="submit" class="btn btn-primary">
Guardar
</button>

</form>

<br>

<div id="mensaje"></div>

</div>

<h3 class="mt-4">Listado</h3>

<table class="table table-bordered">

<thead>
<tr>
<th>ID</th>
<th>Marca</th>
<th>Modelo</th>
<th>Año</th>
<th>Motor</th>
<th>Chasis</th>
</tr>
</thead>

<tbody id="tablaVehiculos">

</tbody>

</table>

</div>

<script src="js/app.js"></script>

</body>
</html>

document.addEventListener("DOMContentLoaded", ()=>{

listar();

document.getElementById("frmVehiculo")
.addEventListener("submit", function(e){

e.preventDefault();

let marca = document.getElementById("marca").value;
let modelo = document.getElementById("modelo").value;
let year = document.getElementById("year").value;
let motor = document.getElementById("motor").value;
let chasis = document.getElementById("chasis").value;

let marcaRegex = /^[A-Z]{3,}$/;
let modeloRegex = /^[A-Za-z ]{4,}$/;
let yearRegex = /^[0-9]{4}$/;

if(!marcaRegex.test(marca)){
alert("Marca inválida");
return;
}

if(!modeloRegex.test(modelo)){
alert("Modelo inválido");
return;
}

if(!yearRegex.test(year)){
alert("Año inválido");
return;
}

let datos = new FormData();

datos.append("marca",marca);
datos.append("modelo",modelo);
datos.append("year",year);
datos.append("motor",motor);
datos.append("chasis",chasis);

fetch("php/guardar.php",{
method:"POST",
body:datos
})
.then(res=>res.text())
.then(respuesta=>{

document.getElementById("mensaje").innerHTML=
`<div class="alert alert-success">${respuesta}</div>`;

listar();

document.getElementById("frmVehiculo").reset();

});

});

});

function listar(){

fetch("php/listar.php")
.then(res=>res.json())
.then(datos=>{

let tabla="";

datos.forEach(v=>{

tabla+=`
<tr>
<td>${v.idVehiculo}</td>
<td>${v.marca}</td>
<td>${v.modelo}</td>
<td>${v.year}</td>
<td>${v.num_motor}</td>
<td>${v.num_chasis}</td>
</tr>
`;

});

document.getElementById("tablaVehiculos").innerHTML=tabla;

});

}

<?php

class Conexion{

private $host="localhost";
private $db="db_parque_vehicular_keyri";
private $user="root";
private $pass="";

public function conectar(){

try{

$conexion = new PDO(
"mysql:host=".$this->host.";dbname=".$this->db,
$this->user,
$this->pass
);

$conexion->setAttribute(
PDO::ATTR_ERRMODE,
PDO::ERRMODE_EXCEPTION
);

return $conexion;

}catch(PDOException $e){

die("Error: ".$e->getMessage());

}

}

}
?>

<?php

class Conexion{

private $host="localhost";
private $db="db_parque_vehicular_keyri";
private $user="root";
private $pass="";

public function conectar(){

try{

$conexion = new PDO(
"mysql:host=".$this->host.";dbname=".$this->db,
$this->user,
$this->pass
);

$conexion->setAttribute(
PDO::ATTR_ERRMODE,
PDO::ERRMODE_EXCEPTION
);

return $conexion;

}catch(PDOException $e){

die("Error: ".$e->getMessage());

}

}

}
?>

<?php

require_once("conexion.php");

$conexion = new Conexion();
$cn = $conexion->conectar();

$sql = "INSERT INTO tbl_vehiculos
(marca,modelo,year,num_motor,num_chasis)
VALUES
(?,?,?,?,?)";

$stmt = $cn->prepare($sql);

$stmt->execute([
$_POST["marca"],
$_POST["modelo"],
$_POST["year"],
$_POST["motor"],
$_POST["chasis"]
]);

echo "Vehículo guardado correctamente";

?><?php

require_once("conexion.php");

$conexion = new Conexion();
$cn = $conexion->conectar();

$sql = "SELECT * FROM tbl_vehiculos";

$stmt = $cn->prepare($sql);

$stmt->execute();

$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($resultado);

?>