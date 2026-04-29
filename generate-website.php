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

// Function to generate fallback website template
function generateFallbackWebsite($prompt) {
    // Extract business info from prompt
    preg_match('/Business Name: ([^\n]+)/', $prompt, $nameMatch);
    preg_match('/Industry: ([^\n]+)/', $prompt, $industryMatch);
    
    $businessName = $nameMatch[1] ?? 'Your Business';
    $industry = $industryMatch[1] ?? 'Professional Services';
    
    $html = <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML_TITLE</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; }
        header h1 { font-size: 2.5em; margin-bottom: 10px; }
        header p { font-size: 1.2em; opacity: 0.95; }
        nav { background: #333; padding: 15px 0; position: sticky; top: 0; z-index: 100; }
        nav ul { list-style: none; display: flex; justify-content: center; flex-wrap: wrap; }
        nav li { margin: 0 20px; }
        nav a { color: white; text-decoration: none; font-weight: 500; transition: color 0.3s; }
        nav a:hover { color: #667eea; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        section { margin: 60px 0; }
        section h2 { font-size: 2em; margin-bottom: 20px; color: #667eea; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin: 30px 0; }
        .feature-card { background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; transition: transform 0.3s; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .feature-card h3 { color: #667eea; margin: 10px 0; }
        form { max-width: 600px; margin: 30px 0; }
        form label { display: block; margin: 15px 0 5px; font-weight: 500; }
        form input, form textarea { width: 100%; padding: 10px; margin: 5px 0 15px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; }
        form button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; transition: opacity 0.3s; }
        form button:hover { opacity: 0.9; }
        footer { background: #333; color: white; text-align: center; padding: 30px 20px; margin-top: 60px; }
        @media (max-width: 768px) { header h1 { font-size: 1.8em; } nav ul { flex-direction: column; } nav li { margin: 10px 0; } }
    </style>
</head>
<body>
    <header>
        <h1>HTML_TITLE</h1>
        <p>Your Professional Online Presence</p>
    </header>
    
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <section id="about">
            <h2>About Us</h2>
            <p>We are a professional INDUSTRY company dedicated to providing exceptional service and solutions to our clients. With years of experience and expertise, we are committed to delivering outstanding results.</p>
        </section>
        
        <section id="services">
            <h2>Our Services</h2>
            <div class="features">
                <div class="feature-card">
                    <h3>Professional Quality</h3>
                    <p>We deliver high-quality solutions tailored to your needs.</p>
                </div>
                <div class="feature-card">
                    <h3>Expert Team</h3>
                    <p>Our experienced team is ready to serve you with excellence.</p>
                </div>
                <div class="feature-card">
                    <h3>24/7 Support</h3>
                    <p>We provide continuous support for your success.</p>
                </div>
            </div>
        </section>
        
        <section id="contact">
            <h2>Get In Touch</h2>
            <form>
                <label>Name</label>
                <input type="text" required>
                
                <label>Email</label>
                <input type="email" required>
                
                <label>Message</label>
                <textarea rows="5" required></textarea>
                
                <button type="submit">Send Message</button>
            </form>
        </section>
    </div>
    
    <footer>
        <p>&copy; 2026 HTML_TITLE. All rights reserved.</p>
    </footer>
</body>
</html>
HTML;
    
    $css = <<<'CSS'
/* Additional responsive styles included in HTML */
CSS;
    
    $js = <<<'JS'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target && target.scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelector('form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! We will get back to you soon.');
    this.reset();
});
JS;
    
    $html = str_replace(['HTML_TITLE', 'INDUSTRY'], [$businessName, $industry], $html);
    
    return [
        'html' => $html,
        'css' => $css,
        'js' => $js
    ];
}

// Google AI API Key - Use environment variable or fallback
$apiKey = getenv('GOOGLE_AI_API_KEY') ?: 'AIzaSyCTuJlrZTyx8vCsEAJqlFeZeDWR2TRMZjo';
$prompt = $data['prompt'];
$use_fallback = isset($data['useFallback']) && $data['useFallback'] === true;

// Try to call Google Generative AI API
if (!$use_fallback) {
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
    
    // Check for quota exceeded or other API errors
    if ($httpCode === 429 || strpos($response, 'RESOURCE_EXHAUSTED') !== false || strpos($response, 'quota') !== false) {
        // API quota exceeded - use fallback
        $fallback = generateFallbackWebsite($prompt);
        $response = json_encode([
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            [
                                'text' => "```html\n" . $fallback['html'] . "\n```\n\n```css\n" . $fallback['css'] . "\n```\n\n```javascript\n" . $fallback['js'] . "\n```"
                            ]
                        ]
                    ]
                ]
            ],
            'fallback' => true,
            'message' => 'Using fallback generator due to API quota limits. A complete website template has been generated.'
        ]);
        echo $response;
        exit();
    }
    
    if ($curlError) {
        // Connection error - use fallback
        $fallback = generateFallbackWebsite($prompt);
        $response = json_encode([
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            [
                                'text' => "```html\n" . $fallback['html'] . "\n```\n\n```css\n" . $fallback['css'] . "\n```\n\n```javascript\n" . $fallback['js'] . "\n```"
                            ]
                        ]
                    ]
                ]
            ],
            'fallback' => true,
            'message' => 'API connection failed. Using fallback generator. A complete website template has been generated.'
        ]);
        echo $response;
        exit();
    }
    
    if ($httpCode !== 200) {
        // API returned error - use fallback
        $fallback = generateFallbackWebsite($prompt);
        $response = json_encode([
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            [
                                'text' => "```html\n" . $fallback['html'] . "\n```\n\n```css\n" . $fallback['css'] . "\n```\n\n```javascript\n" . $fallback['js'] . "\n```"
                            ]
                        ]
                    ]
                ]
            ],
            'fallback' => true,
            'message' => 'API error occurred. Using fallback generator. A complete website template has been generated.'
        ]);
        echo $response;
        exit();
    }
} else {
    // Direct fallback request
    $fallback = generateFallbackWebsite($prompt);
    $response = json_encode([
        'candidates' => [
            [
                'content' => [
                    'parts' => [
                        [
                            'text' => "```html\n" . $fallback['html'] . "\n```\n\n```css\n" . $fallback['css'] . "\n```\n\n```javascript\n" . $fallback['js'] . "\n```"
                        ]
                    ]
                ]
            ]
        ],
        'fallback' => true
    ]);
    echo $response;
    exit();
}

// Success - return the API response
echo $response;
?>
