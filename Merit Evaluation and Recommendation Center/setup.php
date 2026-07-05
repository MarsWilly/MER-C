<?php
// setup.php - Run this file once to create tables, then delete it!
require_once 'config.php';

echo "Running database setup...<br>";

try {
    // Create the 'results' table
    $sql = "CREATE TABLE IF NOT EXISTS results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NULL,
        session_id VARCHAR(255) NULL,
        academic_merit DECIMAL(5,2) DEFAULT 0,
        cocurricular_merit DECIMAL(5,2) DEFAULT 0,
        total_merit DECIMAL(5,2) DEFAULT 0,
        bm_grade INT DEFAULT 0,
        bi_grade INT DEFAULT 0,
        math_grade INT DEFAULT 0,
        sejarah_grade INT DEFAULT 0,
        pakej1_grade INT DEFAULT 0,
        pakej2_grade INT DEFAULT 0,
        best1_grade INT DEFAULT 0,
        best2_grade INT DEFAULT 0,
        package_type VARCHAR(50),
        field_interest VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    echo "✅ 'results' table created successfully.<br>";
    echo "Setup complete! You can now delete this file for security.";
    
} catch (PDOException $e) {
    echo "❌ Setup failed: " . $e->getMessage();
}
?>