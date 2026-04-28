<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['prompt'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing prompt in request']);
    exit();
}

// Google AI API Key
$apiKey = 'AIzaSyCTuJlrZTyx8vCsEAJqlFeZeDWR2TRMZjo';
$prompt = $data['prompt'];

// Call Google Generative AI API
$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . urlencode($apiKey);

$requestBody = json_encode([
    'contents' => [
        [
            'parts' => [
                [
                    'text' => $prompt
                ]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.7,
        'maxOutputTokens' => 8192,
        'topP' => 0.95,
        'topK' => 40
    ]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'error' => 'API Connection Error',
        'message' => $curlError
    ]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode([
        'error' => 'API Error',
        'code' => $httpCode,
        'message' => $response
    ]);
    exit();
}

// Success - return the response
echo $response;
?>
