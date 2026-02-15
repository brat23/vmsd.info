<?php
// Start the session to track submissions
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Be specific in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Rate Limiting ---
// Use a key based on the user's IP address to store submission times
$session_key = 'submissions_' . md5($_SERVER['REMOTE_ADDR']);

if (!isset($_SESSION[$session_key])) {
    $_SESSION[$session_key] = [];
}

$ten_minutes_ago = time() - (10 * 60);

// Discard timestamps older than 10 minutes
$_SESSION[$session_key] = array_filter($_SESSION[$session_key], function($timestamp) use ($ten_minutes_ago) {
    return $timestamp > $ten_minutes_ago;
});

// Check if the user has made 2 or more submissions in the last 10 minutes
if (count($_SESSION[$session_key]) >= 2) {
    http_response_code(429); // HTTP 429 Too Many Requests
    echo json_encode(['success' => false, 'message' => 'You have submitted too frequently. Please try again in 10 minutes.']);
    exit();
}
// --- End Rate Limiting ---

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Sanitize all inputs
    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
    $user_email = filter_var($data['email'] ?? null, FILTER_VALIDATE_EMAIL);
    $phone = filter_var($data['phone'] ?? 'Not provided', FILTER_SANITIZE_STRING);
    $user_message = filter_var($data['message'] ?? 'Not provided', FILTER_SANITIZE_STRING);

    // Basic validation: Name and Email are required
    if ($user_email && !empty($name)) {
        $to = 'bharath@vmsd.in';
        $subject = 'New VMSD Waiting List Signup / Contact';
        
        // Construct the email body
        $email_body = "A new user has signed up for the waiting list:\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $user_email . "\n";
        $email_body .= "Phone: " . $phone . "\n";
        $email_body .= "Message: " . $user_message . "\n";

        $headers = 'From: noreply@vmsd.info' . "\r\n" .
                   'Reply-To: ' . $user_email . "\r\n" .
                   'X-Mailer: PHP/' . phpversion();

        // Attempt to send the email
        if (mail($to, $subject, $email_body, $headers)) {
            // On success, record the time of this submission
            $_SESSION[$session_key][] = time();
            echo json_encode(['success' => true, 'message' => 'Thanks for signing up! You\'ve been added to the waiting list.']);
        } else {
            // Log the error for debugging but show a generic message to the user
            error_log("Mail failed to send. To: $to, From: $user_email");
            echo json_encode(['success' => false, 'message' => 'Could not process your request at this time. Please try again later.']);
        }
    } else {
        // If validation fails
        echo json_encode(['success' => false, 'message' => 'Please provide a valid name and email address.']);
    }
} else {
    // If not a POST request
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>