<?php
require_once 'db.php';

header('Content-Type: application/json');

// Users to seed
$users = [
    [
        'user_id' => 'u_admin_001',
        'username' => 'admin',
        'password' => 'password123',
        'full_name' => 'Burie System Administrator',
        'role' => 'ADMIN',
        'kebele_id' => '01'
    ],
    [
        'user_id' => 'u_clerk_001',
        'username' => 'clerk',
        'password' => 'clerk123',
        'full_name' => 'Records Data Clerk',
        'role' => 'DATA_CLERK',
        'kebele_id' => '02'
    ],
    [
        'user_id' => 'u_citizen_001',
        'username' => 'citizen',
        'password' => 'citizen123',
        'full_name' => 'Public Citizen',
        'role' => 'CITIZEN',
        'kebele_id' => '03'
    ]
];

try {
    foreach ($users as $u) {
        $hash = password_hash($u['password'], PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO users (user_id, username, password_hash, full_name, role, kebele_id) 
                VALUES (:uid, :uname, :hash, :fname, :role, :kid)
                ON DUPLICATE KEY UPDATE password_hash = :hash_upd, full_name = :fname_upd, role = :role_upd";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $u['user_id'],
            ':uname' => $u['username'],
            ':hash' => $hash,
            ':fname' => $u['full_name'],
            ':role' => $u['role'],
            ':kid' => $u['kebele_id'],
            ':hash_upd' => $hash,
            ':fname_upd' => $u['full_name'],
            ':role_upd' => $u['role']
        ]);
    }
    echo json_encode(['message' => 'Users seeded successfully', 'users' => ['admin', 'clerk', 'citizen']]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
