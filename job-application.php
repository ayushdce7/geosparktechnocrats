<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

$toEmail = 'hr@geosparktechnocrats.com';
$toName  = 'GeoSpark Technocrats';

$smtpHost = 'smtp.hostinger.com';
$smtpPort = 465;
$smtpUser = 'hr@geosparktechnocrats.com';

/*
 * IMPORTANT:
 * Put your actual Hostinger mailbox password here.
 */
$smtpPass = 'Geospark$2';


/*
|--------------------------------------------------------------------------
| Get form data
|--------------------------------------------------------------------------
*/

$jobPosition = trim($_POST['job_position'] ?? '');
$name        = trim($_POST['name'] ?? '');
$email       = trim($_POST['email'] ?? '');
$phone       = trim($_POST['phone'] ?? '');
$experience  = trim($_POST['experience'] ?? '');


/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    $jobPosition === '' ||
    $name === '' ||
    $email === '' ||
    $phone === '' ||
    $experience === ''
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);

    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| CV validation
|--------------------------------------------------------------------------
*/

if (!isset($_FILES['cv'])) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Please upload your CV.'
    ]);

    exit;
}

$cv = $_FILES['cv'];

if ($cv['error'] !== UPLOAD_ERR_OK) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'There was a problem uploading your CV.'
    ]);

    exit;
}


/*
 * Maximum 5 MB
 */

$maxFileSize = 5 * 1024 * 1024;

if ($cv['size'] > $maxFileSize) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'CV file size must be less than 5 MB.'
    ]);

    exit;
}


/*
 * Allowed extensions
 */

$allowedExtensions = [
    'pdf',
    'doc',
    'docx'
];

$extension = strtolower(
    pathinfo($cv['name'], PATHINFO_EXTENSION)
);

if (!in_array($extension, $allowedExtensions, true)) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Only PDF, DOC and DOCX files are allowed.'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Send email
|--------------------------------------------------------------------------
*/

$mail = new PHPMailer(true);

try {

    /*
     * SMTP
     */

    $mail->isSMTP();

    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtpPort;

    $mail->CharSet = 'UTF-8';


    /*
     * Sender
     */

    $mail->setFrom(
        $smtpUser,
        'GeoSpark Technocrats Careers'
    );


    /*
     * Reply to applicant
     */

    $mail->addReplyTo(
        $email,
        $name
    );


    /*
     * HR email
     */

    $mail->addAddress(
        $toEmail,
        $toName
    );


    /*
     * Attach CV
     */

    $mail->addAttachment(
        $cv['tmp_name'],
        $cv['name']
    );


    /*
     * Email
     */

    $mail->isHTML(true);

    $mail->Subject =
        'New Job Application - ' . $jobPosition;


    $safeJobPosition = htmlspecialchars(
        $jobPosition,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeName = htmlspecialchars(
        $name,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeEmail = htmlspecialchars(
        $email,
        ENT_QUOTES,
        'UTF-8'
    );

    $safePhone = htmlspecialchars(
        $phone,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeExperience = htmlspecialchars(
        $experience,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeCvName = htmlspecialchars(
        $cv['name'],
        ENT_QUOTES,
        'UTF-8'
    );


    $mail->Body = <<<HTML

<h2 style="color:#1f4d3a;">
    New Job Application
</h2>

<table cellpadding="10" cellspacing="0" border="0"
       style="border-collapse:collapse; width:100%;">

    <tr>
        <td style="font-weight:bold;">Position</td>
        <td>{$safeJobPosition}</td>
    </tr>

    <tr>
        <td style="font-weight:bold;">Applicant Name</td>
        <td>{$safeName}</td>
    </tr>

    <tr>
        <td style="font-weight:bold;">Email</td>
        <td>{$safeEmail}</td>
    </tr>

    <tr>
        <td style="font-weight:bold;">Phone</td>
        <td>{$safePhone}</td>
    </tr>

    <tr>
        <td style="font-weight:bold;">Experience</td>
        <td>{$safeExperience}</td>
    </tr>

    <tr>
        <td style="font-weight:bold;">CV</td>
        <td>{$safeCvName}</td>
    </tr>

</table>

<hr>

<p>
    This application was submitted through
    <strong>geosparktechnocrats.com</strong>.
</p>

HTML;


    /*
     * Plain text version
     */

    $mail->AltBody =
        "New Job Application\n\n" .
        "Position: $jobPosition\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Phone: $phone\n" .
        "Experience: $experience\n" .
        "CV: {$cv['name']}\n";


    /*
     * Send
     */

    $mail->send();


    /*
     * Success
     */

    echo json_encode([
        'success' => true,
        'message' => 'Your application has been submitted successfully.'
    ]);

    exit;


} catch (Exception $e) {

    error_log(
        'Job application email error: ' .
        $mail->ErrorInfo
    );

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Sorry, your application could not be sent. Please try again later.'
    ]);

    exit;
}