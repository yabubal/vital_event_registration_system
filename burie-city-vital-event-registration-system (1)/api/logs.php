<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo) {
    try {
        // Fetch last 100 logs
        $stmt = $pdo->query("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100");
        $logs = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $logs[] = [
                'id' => $row['log_id'],
                'timestamp' => $row['timestamp'],
                'userId' => $row['user_id'],
                'userName' => $row['user_name'],
                'action' => $row['action'],
                'details' => $row['details']
            ];
        }
        echo json_encode($logs);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePost($pdo) {
    try {
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        
        // Validation
        if (!isset($input['action'])) {
            throw new Exception("Action type required");
        }

        $sql = "INSERT INTO audit_logs (user_id, user_name, action, details) 
                VALUES (:uid, :uname, :action, :details)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $input['userId'] ?? 'SYSTEM',
            ':uname' => $input['userName'] ?? 'System',
            ':action' => $input['action'],
            ':details' => $input['details'] ?? ''
        ]);

        echo json_encode(['message' => 'Log saved successfully']);

    } catch (Exception $e) {
        file_put_contents('error.log', date('Y-m-d H:i:s') . " LOG Error: " . $e->getMessage() . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
