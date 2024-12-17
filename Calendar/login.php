<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
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

    try {

        $stmt = $pdo->prepare("SELECT * FROM users WHERE Login = ? AND Password = ?");
        $stmt->execute([$login, $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $_SESSION['user_id'] = $user['userid'];
            echo json_encode(["message" => "Вы успешно вошли!", "userid" => $user['userid']]);
        } else {
            echo json_encode(["message" => "Неправильное имя пользователя или пароль."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}
?>
