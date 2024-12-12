<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'config.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = $_POST['Login'];
    $password = $_POST['Password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE Login = ?");
    $stmt->execute([$login]);
    $user = $stmt->fetch();

    if ($user && $password === $user['Password']) {
        $_SESSION['user_id'] = $user['userid'];
        echo json_encode(["message" => "Вы успешно вошли!", "userid" => $user['userid']]);
    } else {
        echo json_encode(["message" => "Неправильное имя пользователя или пароль."]);
    }
}
?>
