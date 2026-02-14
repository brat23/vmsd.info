<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Be specific about domains in production
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    'message' => 'An unknown error occurred.',
    'data' => []
];

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Fetch all raw signups
    $stmt = $pdo->query("SELECT id, email, signup_date, ip_address, location, newsletter_optin, pdf_requested, area_of_interest, source_page FROM waiting_list ORDER BY signup_date DESC");
    $allSignups = $stmt->fetchAll();

    // --- Aggregated Data ---
    $totalSignups = count($allSignups);
    $uniqueEmails = [];
    foreach ($allSignups as $signup) {
        $uniqueEmails[$signup['email']] = true;
    }
    $totalUniqueEmails = count($uniqueEmails);

    $newsletterOptins = 0;
    $pdfRequests = [];
    $areasOfInterest = [];
    $locations = [];
    $sourcePages = [];

    foreach ($allSignups as $signup) {
        if ($signup['newsletter_optin']) {
            $newsletterOptins++;
        }
        if (!empty($signup['pdf_requested'])) {
            $pdfRequests[$signup['pdf_requested']] = ($pdfRequests[$signup['pdf_requested']] ?? 0) + 1;
        }
        if (!empty($signup['area_of_interest'])) {
            // Assuming area_of_interest might be comma-separated
            $interests = array_map('trim', explode(',', $signup['area_of_interest']));
            foreach ($interests as $interest) {
                if (!empty($interest)) {
                    $areasOfInterest[$interest] = ($areasOfInterest[$interest] ?? 0) + 1;
                }
            }
        }
        if (!empty($signup['location'])) {
            $locations[$signup['location']] = ($locations[$signup['location']] ?? 0) + 1;
        }
        if (!empty($signup['source_page'])) {
            $sourcePages[$signup['source_page']] = ($sourcePages[$signup['source_page']] ?? 0) + 1;
        }
    }

    $response['success'] = true;
    $response['message'] = 'Data fetched successfully.';
    $response['data'] = [
        'totalSignups' => $totalSignups,
        'totalUniqueEmails' => $totalUniqueEmails,
        'newsletterOptins' => $newsletterOptins,
        'pdfRequests' => $pdfRequests,
        'areasOfInterest' => $areasOfInterest,
        'locations' => $locations,
        'sourcePages' => $sourcePages,
        'rawSignups' => $allSignups // Potentially large, consider pagination for production
    ];

} catch (PDOException $e) {
    error_log("Dashboard data error: " . $e->getMessage());
    $response['message'] = 'Failed to fetch dashboard data: ' . $e->getMessage();
}

echo json_encode($response);
?>
