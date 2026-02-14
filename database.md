# Database Setup Guide for VMSD Waiting List

This document outlines the steps to set up the MySQL database and table required for storing waiting list signups.

## 1. Database and User Creation (Shared Hosting / cPanel Example)

Most shared hosting providers offer a control panel (like cPanel) to manage your databases.

1.  **Log in to your hosting control panel** (e.g., cPanel).
2.  **Navigate to the "MySQL® Databases" section.**

3.  **Create a New Database:**
    *   Find the "Create New Database" section.
    *   Enter a database name. A good practice is to prefix it with your cPanel username (e.g., `youruser_vmsd_db`).
    *   Click "Create Database".

4.  **Create a New User for the Database:**
    *   Find the "MySQL Users" section, specifically "Add New User".
    *   Choose a username (e.g., `youruser_vmsd_user`).
    *   Generate a strong password and keep it safe. You will need this for your PHP code.
    *   Click "Create User".

5.  **Add User to Database:**
    *   Find the "Add User To Database" section.
    *   Select the database user you just created.
    *   Select the database you just created.
    *   Click "Add".
    *   On the next screen, grant **ALL PRIVILEGES** to the user for that specific database. This is necessary for the PHP script to insert data.
    *   Click "Make Changes".

    *Note: Remember your Database Name, Username, and Password. These will be used in the PHP script.*

## 2. Table Schema Creation

Once your database is created and a user assigned, you need to create the table to store the email addresses and additional user data.

You can do this using phpMyAdmin (usually accessible from your control panel) or via a MySQL client.

1.  **Access phpMyAdmin:** In your hosting control panel, find the phpMyAdmin link and open it.
2.  **Select your newly created database** from the left sidebar.
3.  **Go to the "SQL" tab.**

4.  **Execute the following SQL query** to create the `waiting_list` table (or modify it if it already exists by using `ALTER TABLE` statements):

    ```sql
    CREATE TABLE `waiting_list` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `signup_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `ip_address` VARCHAR(45) NULL,           -- Stores IPv4 or IPv6 address of the user
        `location` VARCHAR(255) NULL,           -- Stores estimated geographic location (e.g., city, country)
        `newsletter_optin` BOOLEAN DEFAULT FALSE, -- True if user opted into newsletter
        `pdf_requested` VARCHAR(255) NULL,      -- e.g., 'Learning_Three.js_PDF'
        `area_of_interest` TEXT NULL,           -- User's area of interest (can be multiple, comma-separated)
        `source_page` VARCHAR(255) NULL         -- Which page the user signed up from (e.g., 'main_site', 'free_pdf_landing')
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ```

    *   `id`: A unique identifier for each signup, auto-increments.
    *   `email`: Stores the user's email address. It's set to `NOT NULL` and `UNIQUE` to prevent duplicate entries.
    *   `signup_date`: Automatically records the date and time of the signup.
    *   `ip_address`: Stores the IP address of the user at the time of signup. Can be used for basic location estimation or bot detection.
    *   `location`: Stores an estimated geographic location derived from the IP address or provided by the user.
    *   `newsletter_optin`: A boolean flag indicating if the user has consented to receive newsletters.
    *   `pdf_requested`: Stores a string indicating which free PDF the user requested, if any.
    *   `area_of_interest`: A text field to store the user's indicated areas of interest. This could be a comma-separated list or a single descriptive string.
    *   `source_page`: Records the URL or identifier of the page where the user submitted their information, useful for tracking campaign effectiveness.

## 3. Database Credentials (for PHP)

You will need the following information to connect from your PHP script:

*   **DB_HOST**: Usually `localhost` for shared hosting, but check your provider's documentation.
*   **DB_NAME**: The full database name (e.g., `youruser_vmsd_db`).
*   **DB_USER**: The full database username (e.g., `youruser_vmsd_user`).
*   **DB_PASS**: The strong password you generated for the database user.

**Security Note:**
For production environments, it's recommended to store these credentials outside your web-accessible directory or use environment variables to enhance security. For this project, they will be defined directly in the `send_email.php` file for simplicity, but be aware of the security implications.

## 4. Viewing and Processing Emails (Further Steps)

After setting up the database and modifying `send_email.php`, signups will be stored. To view them:

1.  **Using phpMyAdmin:** You can browse the `waiting_list` table directly in phpMyAdmin to see all entries.
2.  **Via a custom PHP script:** A simple PHP script can connect to the database, query the `waiting_list` table, and display the results in a web page or export them (e.g., to CSV). This will be provided in a later step.

This completes the database setup. Next, you will integrate this into your `send_email.php` script.