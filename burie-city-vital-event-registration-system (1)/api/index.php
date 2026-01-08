<?php
// Silence is golden, or at least JSON is.
header('Content-Type: application/json');
echo json_encode(['status' => 'API is working', 'message' => 'Welcome to the Burie City API']);
?>
