<?php

$con= mysqli_connect("HOST", "USUARIO", "PASS", "BBDD");
if($con){

$image=$_POST['image'];
$titulo=$_POST['titulo'];
$usuario=$_POST['usuario'];
$fecha=$_POST['fecha'];
$lat=$_POST['lat'];
$longi=$_POST['longi'];

$sql = "INSERT INTO imagen (nombre,user,fecha, lat, lon) values (?,?,?,?,?)";
$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "sssss", $titulo, $usuario, $fecha, $lat, $longi);
mysqli_stmt_execute($stmt);
if(mysqli_stmt_errno($stmt)!=0){
  echo "Error de sentencia: " . mysqli_stmt_error($stmt);
}else{
  $binary= base64_decode($image);
  header('Content-Type: bitmap; charset=utf-8');
  $file=fopen("algo/" . $titulo . '.jpg', 'w+');
  fwrite($file, $binary);
  fclose($file);



  echo "New record created successfully";

}

$con->close();
}else{
	echo "La conexion ha fallado";
}
?>
