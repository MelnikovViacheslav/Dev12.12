<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = $_POST['Login'];
    $password = $_POST['Password'];

    $stmt = $pdo->prepare("INSERT INTO users (Login, Password) VALUES (?, ?)");
    if ($stmt->execute([$login, $password])) {
        echo json_encode(["message" => "Регистрация прошла успешно!"]);
    } else {
        echo json_encode(["message" => "Ошибка регистрации."]);
    }
}
?>
