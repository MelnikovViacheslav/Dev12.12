<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $userid = $data['userid'];
    $eventTitle = $data['title'];
    $startDate = $data['start'];
    $endDate = $data['end'];


    $stmt = $pdo->prepare("INSERT INTO calendar (userid, Event, date) VALUES (?, ?, ?)");
    

    if ($stmt->execute([$userid, $eventTitle, $startDate])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Ошибка при добавлении события."]);
    }
}
?>
