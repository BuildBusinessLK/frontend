import React, { useState } from 'react';
import './AdsGenerationPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5003';

const AdsGenerationPage = () => {
  const [formData, setFormData] = useState({
    idea: '',
    productType: '',
    targetAudience: '',
    tone: 'Professional and Engaging'
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateAds = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

const token = localStorage.getItem("token");

const res = await fetch(`${API_BASE_URL}/api/ads/generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    idea: formData.idea,
    product_type: formData.productType,
    target_audience: formData.targetAudience,
    tone: formData.tone
  })
});
      };

      if (!res.ok) {
        throw new Error('Failed to generate ads');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    if (!response || !response.share_links) return;

    const links = response.share_links;
    let url = '';

    switch(platform) {
      case 'facebook':
        url = links.facebook;
        break;
      case 'instagram':
        alert('Please copy the generated ads and share manually on Instagram');
        return;
      case 'tiktok':
        alert('Please share the generated ads on TikTok');
        return;
      case 'whatsapp':
        url = links.whatsapp;
        break;
      default:
        return;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="ads-generation-container">
      <div className="ads-header">
        <h1>🎨 Creative Ads Generator</h1>
        <p>Transform your business idea into compelling ads for social media, with a side chat to refine the brief.</p>
      </div>

      <div className="ads-content">
        <div className="ads-main-column">
          {/* Form Section */}
          <div className="ads-form-section">
            <form onSubmit={handleGenerateAds}>
              <div className="form-group">
                <label htmlFor="idea">Your Business Idea *</label>
                <textarea
                  id="idea"
                  name="idea"
                  value={formData.idea}
                  onChange={handleInputChange}
                  placeholder="Describe your business idea, product, or service..."
                  required
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productType">Product/Service Type</label>
                  <input
                    type="text"
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    placeholder="e.g., SaaS, E-commerce, Consulting"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Target Audience</label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="e.g., Young professionals, Business owners"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tone">Tone/Style</label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                >
                  <option value="Professional and Engaging">Professional and Engaging</option>
                  <option value="Casual and Fun">Casual and Fun</option>
                  <option value="Serious and Trustworthy">Serious and Trustworthy</option>
                  <option value="Playful and Creative">Playful and Creative</option>
                  <option value="Minimalist and Modern">Minimalist and Modern</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="generate-btn"
                disabled={loading}
              >
                {loading ? 'Generating...' : '✨ Generate Ads'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {response && response.status === 'success' && (
            <div className="ads-results-section">
              <h2>Generated Ads</h2>

              <div className="prompt-box">
                <h3>Generated Prompt</h3>
                <p>{response.prompt}</p>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(response.prompt)}
                >
                  📋 Copy Prompt
                </button>
              </div>

              <div className="ads-box">
                <h3>Ad Variations</h3>
                <div className="ads-content-display">
                  {response.generated_ads}
                </div>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(response.generated_ads)}
                >
                  📋 Copy All Ads
                </button>
              </div>

              <div className="share-section">
                <h3>Share to Social Media</h3>
                <div className="share-buttons">
                  <button 
                    className="share-btn facebook"
                    onClick={() => handleShare('facebook')}
                  >
                    📱 Facebook
                  </button>
                  <button 
                    className="share-btn instagram"
                    onClick={() => handleShare('instagram')}
                  >
                    📸 Instagram
                  </button>
                  <button 
                    className="share-btn tiktok"
                    onClick={() => handleShare('tiktok')}
                  >
                    🎵 TikTok
                  </button>
                  <button 
                    className="share-btn whatsapp"
                    onClick={() => handleShare('whatsapp')}
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {response && response.status === 'error' && (
            <div className="error-message">
              <strong>Error:</strong> {response.message}
            </div>
          )}
        </div>

        <div className="ads-side-panel" />
      </div>
    </div>
  );
;

export default AdsGenerationPage;
