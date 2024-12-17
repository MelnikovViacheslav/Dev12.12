<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userid = $_GET['userid'] ?? null;

    if ($userid) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM calendar WHERE userid = ?");
            $stmt->execute([$userid]);
            
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(["status" => "success", "events" => $events]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User ID is required."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title'], $data['start'], $data['userid'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE userid = ?");
        $stmt->execute([$data['userid']]);
        
        if ($stmt->rowCount() === 0) {
            echo json_encode(["status" => "error", "message" => "User ID does not exist."]);
            exit();
        }


        $endDateTime = $data['start'];
        $stmt = $pdo->prepare("INSERT INTO calendar (title, description, start, end, userid) VALUES (?, ?, ?, ?, ?)");
        
        if ($stmt->execute([$data['title'], $data['description'], $data['start'], $endDateTime, $data['userid']])) {
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to save event."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>
