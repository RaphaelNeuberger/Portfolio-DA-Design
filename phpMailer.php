<?php
/**
 * Contact form endpoint for raphael-neuberger.de
 *
 * - Same-origin only (no CORS wildcard)
 * - Accepts JSON (fetch) and classic form posts (no-JS fallback)
 * - Honeypot + length limits against spam/abuse
 * - Header-injection safe (Reply-To only from a validated address)
 */

declare(strict_types=1);

const SITE_EMAIL = 'info@newmountains.it';
const ALLOWED_HOSTS = ['raphael-neuberger.de', 'www.raphael-neuberger.de'];
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/**
 * Sends a JSON response and stops execution.
 */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

/**
 * Rejects cross-site requests based on the Origin/Referer header.
 */
function assertSameOrigin(): void
{
    $source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($source === '') {
        return; // some privacy tools strip both headers – allow, honeypot still applies
    }
    $host = parse_url($source, PHP_URL_HOST) ?: '';
    if (!in_array(strtolower($host), ALLOWED_HOSTS, true)) {
        respond(403, ['success' => false, 'error' => 'Forbidden']);
    }
}

/**
 * Reads the request body as JSON or form data.
 */
function readInput(): array
{
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($type, 'application/json') !== false) {
        $data = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($data)) {
            respond(400, ['success' => false, 'error' => 'Invalid JSON']);
        }
        return $data;
    }
    return $_POST;
}

/**
 * Trims a value and strips control characters (except line breaks in messages).
 */
function clean($value, bool $multiline = false): string
{
    $value = trim((string) ($value ?? ''));
    $pattern = $multiline ? '/[^\P{C}\n\r\t]/u' : '/\p{C}/u';
    return (string) preg_replace($pattern, '', $value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'error' => 'Method not allowed']);
}

assertSameOrigin();
$input = readInput();

// Honeypot: bots fill hidden fields – pretend success, send nothing.
if (clean($input['website'] ?? '') !== '') {
    respond(200, ['success' => true]);
}

$name = clean($input['name'] ?? '');
$email = clean($input['email'] ?? '');
$message = clean($input['message'] ?? '', true);

$valid = mb_strlen($name) >= 2 && mb_strlen($name) <= MAX_NAME
    && mb_strlen($email) <= MAX_EMAIL && filter_var($email, FILTER_VALIDATE_EMAIL)
    && mb_strlen($message) >= 5 && mb_strlen($message) <= MAX_MESSAGE;

if (!$valid) {
    respond(400, ['success' => false, 'error' => 'Invalid input data']);
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$subject = '=?UTF-8?B?' . base64_encode('Portfolio-Kontakt: ' . $name) . '?=';
$body = "<strong>Name:</strong> {$safeName}<br>"
    . "<strong>E-Mail:</strong> {$safeEmail}<br><br>"
    . "<strong>Nachricht:</strong><br>{$safeMessage}";

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'From: Portfolio raphael-neuberger.de <' . SITE_EMAIL . '>',
    'Reply-To: ' . $email,
]);

$sent = mail(SITE_EMAIL, $subject, $body, $headers, '-f' . SITE_EMAIL);

if (!$sent) {
    respond(500, ['success' => false, 'error' => 'Mail delivery failed']);
}

respond(200, ['success' => true]);
