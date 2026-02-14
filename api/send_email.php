<?php
         header('Content-Type: application/json');
         // It's crucial to set Access-Control-Allow-Origin to your specific domain in production
         // For local development, '*' can be used, but replace it with your actual frontend domain for security.
         header('Access-Control-Allow-Origin: *');
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
        define('DB_NAME', 'youruser_vmsd_db'); // e.g., youruser_vmsd_db
        define('DB_USER', 'youruser_vmsd_user'); // e.g., youruser_vmsd_user
        define('DB_PASS', 'YourStrongPassword'); // e.g., YourStrongPassword
        // ------------------------------
   
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
   
            $user_email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
   
            if ($user_email) {
                $db_success = false;
                $db_message = '';

                try {
                    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

                    // Check if email already exists
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM waiting_list WHERE email = :email");
                    $stmt->execute([':email' => $user_email]);
                    if ($stmt->fetchColumn() > 0) {
                        echo json_encode(['success' => false, 'message' => 'This email is already on the waiting list.']);
                        exit();
                    }
                    
                    $stmt = $pdo->prepare("INSERT INTO waiting_list (email) VALUES (:email)");
                    $stmt->execute([':email' => $user_email]);
                    $db_success = true;
                    $db_message = 'Email saved to database.';

                } catch (PDOException $e) {
                    error_log("Database error: " . $e->getMessage());
                    $db_message = 'Failed to save email to database. Please try again later.';
                    // If it's a duplicate entry error, provide a more user-friendly message
                    if ($e->getCode() == 23000) { // SQLSTATE for Integrity Constraint Violation (e.g., duplicate unique key)
                         $db_message = 'This email is already on the waiting list.';
                    }
                }

                // If database insertion failed, report that.
                if (!$db_success) {
                    echo json_encode(['success' => false, 'message' => $db_message]);
                    exit();
                }

                // Proceed with sending email only if database save was successful
                $to = 'bharath@vmsd.in'; // Recipient email address
                $subject = 'New VMSD Waiting List Signup';
                $message = "A new user has signed up for the waiting list:\n\nEmail: " . $user_email;
                $headers = 'From: noreply@vmsd.info' . "\r\n" . // Replace with your domain
                           'Reply-To: ' . $user_email . "\r\n" .
                           'X-Mailer: PHP/' . phpversion();
   
                // Attempt to send the email
                if (mail($to, $subject, $message, $headers)) {
                    echo json_encode(['success' => true, 'message' => 'Thanks for signing up! You\'ve been added to the waiting list.']);
                } else {
                    // Log mail() errors for debugging. Check your PHP error logs.
                    error_log("Failed to send email to $to from $user_email");
                    echo json_encode(['success' => false, 'message' => 'Successfully added to waiting list, but failed to send confirmation email.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid email address provided.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid request method. Only POST is accepted.']);
        }
        ?>