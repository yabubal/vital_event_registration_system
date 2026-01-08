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
    case 'PUT':
        handlePut($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo) {
    try {
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $sql = "SELECT * FROM vital_records";
        $params = [];

        if ($search) {
            // Search in ID or inside the JSON metadata (name, etc.)
            $sql .= " WHERE record_id LIKE :search OR metadata LIKE :search";
            $params[':search'] = "%$search%";
        }

        $sql .= " ORDER BY registration_date DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $records = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Parse JSON metadata back to array
            if ($row['metadata']) {
                $row['data'] = json_decode($row['metadata'], true); // Map metadata to data for frontend
                unset($row['metadata']);
            }
            // Add other frontend-specific fields if needed, or map them
            $row['id'] = $row['record_id']; // Map DB record_id to frontend id
            $row['kebele'] = $row['kebele_id']; // Map DB kebele_id to frontend kebele
            $row['registrationDate'] = $row['registration_date'];
            $row['applicantId'] = $row['applicant_id'];
            $row['type'] = $row['event_type'];
            // Mock documents and auditTrail for now as they are complex structures
            $row['documents'] = []; 
            $row['auditTrail'] = [];
            
            $records[] = $row;
        }
        echo json_encode($records);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePost($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Frontend sends a single record or list? 
        // Based on App.tsx logic: onSubmit -> saveRecords([new, ...old])
        // We should probably change frontend to just send the NEW record.
        // For now, let's assume we are receiving a SINGLE record to Create.
        
        if (!isset($input['id'])) {
           throw new Exception("Invalid input data");
        }

        $sql = "INSERT INTO vital_records (record_id, event_type, kebele_id, status, registration_date, applicant_id, metadata) 
                VALUES (:id, :type, :kebele, :status, :date, :applicantId, :metadata)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':type' => $input['type'],
            ':kebele' => $input['kebele'],
            ':status' => $input['status'],
            ':date' => date('Y-m-d H:i:s', strtotime($input['registrationDate'])), // Ensure MySQL format
            ':applicantId' => $input['applicantId'],
            ':metadata' => json_encode($input['data'])
        ]);

        echo json_encode(['message' => 'Record created successfully', 'id' => $input['id']]);

    } catch (Exception $e) {
        file_put_contents('error.log', date('Y-m-d H:i:s') . " POST Error: " . $e->getMessage() . "\nInput: " . file_get_contents('php://input') . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePut($pdo) {
     try {
        $rawInput = file_get_contents('php://input');
        
        // Recursive decode to handle JSON strings being sent as body
        $input = $rawInput;
        for ($i = 0; $i < 3; $i++) {
            if (is_string($input)) {
                $decoded = json_decode($input, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $input = $decoded;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        
        // Update status or other fields
        if (!is_array($input) || !isset($input['id'])) {
             throw new Exception("Record ID required. Input: " . substr($rawInput, 0, 50));
        }

        $sql = "UPDATE vital_records SET status = :status WHERE record_id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':status' => $input['status'],
            ':id' => $input['id']
        ]);

        echo json_encode(['message' => 'Record updated successfully']);

    } catch (Exception $e) {
        file_put_contents('error.log', date('Y-m-d H:i:s') . " PUT Error: " . $e->getMessage() . "\nInput: " . file_get_contents('php://input') . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
