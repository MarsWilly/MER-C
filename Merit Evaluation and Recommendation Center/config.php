<?php
// config.php - Database configuration for InfinityFree

$host = 'sql123.infinityfree.com';  // Your InfinityFree MySQL host
$dbname = 'your_database_name';     // Your database name
$username = 'your_username';        // Your database username
$password = 'your_password';        // Your database password

// Set up a PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Enable CORS for your frontend (crucial for API calls)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
?>