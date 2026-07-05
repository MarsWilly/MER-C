<?php
// api.php - Main API endpoint
require_once 'config.php';

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));

// Simple routing: /api/results/save
$resource = $request[0] ?? '';
$action = $request[1] ?? '';

// Get JSON input if it's a POST or PUT request
$input = json_decode(file_get_contents('php://input'), true);

// Handle preflight OPTIONS request (CORS)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- ROUTING ---
if ($resource === 'results') {
    switch ($method) {
        case 'POST':
            if ($action === 'save') {
                saveResult($pdo, $input);
            } else {
                sendError('Invalid action');
            }
            break;
        case 'GET':
            if ($action === 'session') {
                $sessionId = $request[2] ?? '';
                if ($sessionId) {
                    getSessionResults($pdo, $sessionId);
                } else {
                    sendError('Session ID required');
                }
            } else {
                sendError('Invalid action');
            }
            break;
        case 'DELETE':
            // Example: /api/results/delete/123
            $resultId = $action;
            if ($resultId && is_numeric($resultId)) {
                deleteResult($pdo, $resultId);
            } else {
                sendError('Valid Result ID required');
            }
            break;
        default:
            sendError('Method not allowed', 405);
    }
} else {
    sendError('Resource not found', 404);
}

// --- FUNCTION DEFINITIONS ---

function saveResult($pdo, $data) {
    try {
        // Extract data from the frontend request
        $sessionId = $data['session_id'] ?? null;
        $academicMerit = $data['academic_merit'] ?? 0;
        $cocurricularMerit = $data['cocurricular_merit'] ?? 0;
        $totalMerit = $data['total_merit'] ?? 0;
        $grades = $data['grades'] ?? [];
        $packageType = $data['package_type'] ?? null;
        $fieldInterest = $data['field_interest'] ?? null;

        // Prepare the SQL statement
        $sql = "INSERT INTO results 
                (session_id, academic_merit, cocurricular_merit, total_merit, 
                 bm_grade, bi_grade, math_grade, sejarah_grade, 
                 pakej1_grade, pakej2_grade, best1_grade, best2_grade, 
                 package_type, field_interest) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $sessionId,
            $academicMerit,
            $cocurricularMerit,
            $totalMerit,
            $grades['bm'] ?? 0,
            $grades['bi'] ?? 0,
            $grades['math'] ?? 0,
            $grades['sejarah'] ?? 0,
            $grades['pakej1'] ?? 0,
            $grades['pakej2'] ?? 0,
            $grades['best1'] ?? 0,
            $grades['best2'] ?? 0,
            $packageType,
            $fieldInterest
        ]);

        $resultId = $pdo->lastInsertId();

        // Send a success response back to the frontend
        sendSuccess('Result saved successfully', ['id' => $resultId]);
    } catch (Exception $e) {
        sendError('Failed to save result: ' . $e->getMessage());
    }
}

function getSessionResults($pdo, $sessionId) {
    try {
        $sql = "SELECT * FROM results WHERE session_id = ? ORDER BY created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$sessionId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendSuccess('Results retrieved successfully', $results);
    } catch (Exception $e) {
        sendError('Failed to fetch results: ' . $e->getMessage());
    }
}

function deleteResult($pdo, $resultId) {
    try {
        $sql = "DELETE FROM results WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$resultId]);

        if ($stmt->rowCount() > 0) {
            sendSuccess('Result deleted successfully');
        } else {
            sendError('Result not found', 404);
        }
    } catch (Exception $e) {
        sendError('Failed to delete result: ' . $e->getMessage());
    }
}

// --- HELPER FUNCTIONS ---
function sendSuccess($message, $data = null) {
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
    exit();
}

function sendError($message, $code = 400) {
    header('Content-Type: application/json');
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}
?>