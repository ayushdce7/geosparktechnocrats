<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

$toEmail = 'business@geosparktechnocrats.com';
$toName  = 'GeoSpark Technocrats';

$smtpHost = 'smtp.hostinger.com';
$smtpPort = 465;
$smtpUser = 'business@geosparktechnocrats.com';
$smtpPass = 'Geospark$1';

/*
|--------------------------------------------------------------------------
| Get form data
|--------------------------------------------------------------------------
*/

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$project = trim($_POST['project'] ?? '');
$message = trim($_POST['message'] ?? '');

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    exit('Please fill in all required fields.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Please enter a valid email address.');
}

/*
|--------------------------------------------------------------------------
| Send email
|--------------------------------------------------------------------------
*/

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtpPort;

    $mail->CharSet = 'UTF-8';

    /*
     * Sender should be your own domain email.
     * Do not use the visitor's email as From.
     */
    $mail->setFrom($smtpUser, 'GeoSpark Technocrats Website');

    /*
     * Reply directly to the person who submitted the form.
     */
    $mail->addReplyTo($email, $name);

    /*
     * Where the enquiry should arrive.
     */
    $mail->addAddress($toEmail, $toName);

    $mail->isHTML(true);

    $mail->Subject = 'New Website Enquiry - GeoSpark Technocrats';

    $mail->Body = '
        <h2>New Website Enquiry</h2>

        <table cellpadding="8" cellspacing="0" border="0">
            <tr>
                <td><strong>Name:</strong></td>
                <td>' . htmlspecialchars($name) . '</td>
            </tr>

            <tr>
                <td><strong>Email:</strong></td>
                <td>' . htmlspecialchars($email) . '</td>
            </tr>

            <tr>
                <td><strong>Phone:</strong></td>
                <td>' . htmlspecialchars($phone) . '</td>
            </tr>

            <tr>
                <td><strong>Service:</strong></td>
                <td>' . htmlspecialchars($service) . '</td>
            </tr>

            <tr>
                <td><strong>Project Location:</strong></td>
                <td>' . htmlspecialchars($project) . '</td>
            </tr>
        </table>

        <h3>Project Requirements</h3>

        <p>' . nl2br(htmlspecialchars($message)) . '</p>

        <hr>

        <p>
            <small>
                This enquiry was submitted through
                geosparktechnocrats.com
            </small>
        </p>
    ';

    $mail->AltBody =
        "New Website Enquiry\n\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Phone: $phone\n" .
        "Service: $service\n" .
        "Project Location: $project\n\n" .
        "Project Requirements:\n$message";

    $mail->send();

    /*
     * Redirect back to website with success message.
     */
    header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Message sent successfully.'
]);
    exit;

} catch (Exception $e) {

    error_log('Contact form error: ' . $mail->ErrorInfo);

    http_response_code(500);
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'message' => 'Sorry, your message could not be sent.'
    ]);

    exit;
}