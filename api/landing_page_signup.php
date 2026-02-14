<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Be specific about domains in production
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Database Configuration ---
// !!! IMPORTANT: Replace these with your actual database credentials from database.md !!!
define('DB_HOST', 'localhost');
define('DB_NAME', 'youruser_vmsd_db');
define('DB_USER', 'youruser_vmsd_user');
define('DB_PASS', 'YourStrongPassword');
// ------------------------------

$response = [
    'success' => false,
    'message' => 'An unknown error occurred.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // --- Input Validation ---
    $user_email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $newsletter_optin = filter_var($data['newsletter_optin'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $pdf_requested = filter_var($data['pdf_requested'] ?? '', FILTER_SANITIZE_STRING);
    $area_of_interest = filter_var($data['area_of_interest'] ?? '', FILTER_SANITIZE_STRING);
    $source_page = filter_var($data['source_page'] ?? 'unknown', FILTER_SANITIZE_STRING);

    if (!$user_email) {
        $response['message'] = 'Invalid email address provided.';
        echo json_encode($response);
        exit();
    }
    if (empty($pdf_requested)) {
        $response['message'] = 'Please select a PDF to receive.';
        echo json_encode($response);
        exit();
    }

    // --- Capture IP Address ---
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    // --- Basic Location Lookup (conceptual, would require an external API for accuracy) ---
    // For a real-world scenario, you'd integrate with a GeoIP service here.
    // Example: $location = get_location_from_ip($ip_address);
    $location = 'Unknown'; // Placeholder

    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Check if email already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM waiting_list WHERE email = :email");
        $stmt->execute([':email' => $user_email]);
        if ($stmt->fetchColumn() > 0) {
            $response['message'] = 'This email is already on the waiting list.';
            echo json_encode($response);
            exit();
        }
        
        $stmt = $pdo->prepare(
            "INSERT INTO waiting_list (email, ip_address, location, newsletter_optin, pdf_requested, area_of_interest, source_page) 
             VALUES (:email, :ip_address, :location, :newsletter_optin, :pdf_requested, :area_of_interest, :source_page)"
        );
        $stmt->execute([
            ':email' => $user_email,
            ':ip_address' => $ip_address,
            ':location' => $location,
            ':newsletter_optin' => $newsletter_optin,
            ':pdf_requested' => $pdf_requested,
            ':area_of_interest' => $area_of_interest,
            ':source_page' => $source_page
        ]);

        $response['success'] = true;
        $response['message'] = 'Thanks for signing up! Your PDF is on its way.';

    } catch (PDOException $e) {
        error_log("Landing page signup database error: " . $e->getMessage());
        $response['message'] = 'Failed to process your request. Please try again later.';
        if ($e->getCode() == 23000) { // SQLSTATE for Integrity Constraint Violation (e.g., duplicate unique key)
            $response['message'] = 'This email is already on the waiting list.';
        }
    }
} else {
    $response['message'] = 'Invalid request method. Only POST is accepted.';
}

echo json_encode($response);
?>
