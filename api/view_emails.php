<?php
// view_emails.php - Simple script to display collected waiting list emails

// --- Database Configuration ---
// !!! IMPORTANT: Replace these with your actual database credentials from database.md !!!
define('DB_HOST', 'localhost');
define('DB_NAME', 'youruser_vmsd_db'); // e.g., youruser_vmsd_db
define('DB_USER', 'youruser_vmsd_user'); // e.g., youruser_vmsd_user
define('DB_PASS', 'YourStrongPassword'); // e.g., YourStrongPassword
// ------------------------------

$emails = [];
$error_message = '';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $stmt = $pdo->query("SELECT id, email, signup_date FROM waiting_list ORDER BY signup_date DESC");
    $emails = $stmt->fetchAll();

} catch (PDOException $e) {
    $error_message = "Database connection or query failed: " . $e->getMessage();
    error_log("view_emails.php error: " . $error_message);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VMSD Waiting List</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #34495e;
            text-align: center;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .error {
            color: #e74c3c;
            background-color: #fdd;
            border: 1px solid #e74c3c;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>VMSD Waiting List Subscribers</h1>

        <?php if ($error_message): ?>
            <div class="error">
                <p><?php echo $error_message; ?></p>
            </div>
        <?php endif; ?>

        <?php if (!empty($emails)): ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Signup Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($emails as $email_entry): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($email_entry['id']); ?></td>
                            <td><?php echo htmlspecialchars($email_entry['email']); ?></td>
                            <td><?php echo htmlspecialchars($email_entry['signup_date']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p style="text-align: center;">No subscribers found yet.</p>
        <?php endif; ?>
    </div>
</body>
</html>
