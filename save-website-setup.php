<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    $required_fields = ['businessName', 'industry', 'businessDescription', 'targetAudience', 'websiteGoal'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
            exit();
        }
    }

    // Prepare variables
    $business_name = $conn->real_escape_string($data['businessName']);
    $industry = $conn->real_escape_string($data['industry']);
    $business_description = $conn->real_escape_string($data['businessDescription']);
    $target_audience = $conn->real_escape_string($data['targetAudience']);
    $website_goal = $conn->real_escape_string($data['websiteGoal']);
    $current_website = $conn->real_escape_string($data['currentWebsite'] ?? '');
    $additional_notes = $conn->real_escape_string($data['additionalNotes'] ?? '');

    // Convert features to integers (0 or 1)
    $features = $data['features'] ?? [];
    $contact_form = $features['contactForm'] ? 1 : 0;
    $product_showcase = $features['productShowcase'] ? 1 : 0;
    $blog = $features['blog'] ? 1 : 0;
    $ecommerce = $features['ecommerce'] ? 1 : 0;
    $newsletter = $features['newsletter'] ? 1 : 0;

    // Prepare SQL statement
    $sql = "INSERT INTO website_setups (
        business_name, 
        industry, 
        business_description, 
        target_audience, 
        website_goal, 
        current_website, 
        contact_form, 
        product_showcase, 
        blog, 
        ecommerce, 
        newsletter, 
        additional_notes
    ) VALUES (
        '$business_name',
        '$industry',
        '$business_description',
        '$target_audience',
        '$website_goal',
        '$current_website',
        $contact_form,
        $product_showcase,
        $blog,
        $ecommerce,
        $newsletter,
        '$additional_notes'
    )";

    if ($conn->query($sql) === TRUE) {
        $setup_id = $conn->insert_id;
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Website setup saved successfully',
            'setup_id' => $setup_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error saving website setup: ' . $conn->error
        ]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all website setups
    $sql = "SELECT * FROM website_setups ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $setups = [];
        while ($row = $result->fetch_assoc()) {
            $setups[] = $row;
        }
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $setups,
            'total' => count($setups)
        ]);
    } else {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [],
            'total' => 0
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

$conn->close();
?>
