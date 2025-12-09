<?php
$host = "localhost";
$user = "root"; // User default XAMPP
$pass = "";     // Password default XAMPP kosong
$db   = "db_attibyan";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi Gagal: " . mysqli_connect_error());
}
?>