import React, { useState } from 'react';
import './AdsGenerationPage.css';
import { authHeaders } from '../services/authApi';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8083';

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
  const [visuals, setVisuals] = useState({});
  const [loadingVisuals, setLoadingVisuals] = useState(false);
  const [revision, setRevision] = useState('');
  const [conversation, setConversation] = useState([]);

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
      const res = await fetch(`${API_BASE_URL}/api/ads/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders()
        },
        body: JSON.stringify({
          idea: formData.idea,
          product_type: formData.productType,
          target_audience: formData.targetAudience,
          tone: formData.tone
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate ads');
      }

      const data = await res.json();
      const generatedAds = data.generatedAds || data.generated_ads || '';
      setResponse({
        ...data,
        generatedAds,
        generated_ads: generatedAds,
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateVisuals = async (instruction = '') => {
    if (!response?.generatedAds) return;
    setLoadingVisuals(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ads/visuals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ idea: formData.idea, generatedAds: response.generatedAds, instruction }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to generate visual ads');
      setVisuals(data.images || {});
      return data;
    } finally {
      setLoadingVisuals(false);
    }
  };

  const handleRevision = async (e) => {
    e.preventDefault();
    const instruction = revision.trim();
    if (!instruction || !response?.generatedAds) return;
    setConversation((items) => [...items, { role: 'user', text: instruction }]);
    setRevision('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/ads/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          idea: `${formData.idea}\n\nCurrent ad copy:\n${response.generatedAds}\n\nEdit request: ${instruction}`,
          product_type: formData.productType,
          target_audience: formData.targetAudience,
          tone: formData.tone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.generatedAds) throw new Error('Could not apply that change');
      setResponse((current) => ({ ...current, generatedAds: data.generatedAds, generated_ads: data.generatedAds }));
      if (Object.keys(visuals).length) await generateVisuals(instruction);
      setConversation((items) => [...items, { role: 'assistant', text: 'Updated the ad copy and regenerated the visual creative where applicable.' }]);
    } catch (err) {
      setConversation((items) => [...items, { role: 'assistant', text: err.message || 'I could not apply that change.' }]);
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
                  {response.generatedAds || response.generated_ads}
                </div>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(response.generated_ads)}
                >
                  📋 Copy All Ads
                </button>
              </div>

              <div className="ads-box">
                <h3>Professional Visual Ads</h3>
                <p>Generate image creatives sized for Facebook/LinkedIn, Instagram/WhatsApp, and TikTok. The text ad remains available above.</p>
                <button className="copy-btn" onClick={() => generateVisuals()} disabled={loadingVisuals}>
                  {loadingVisuals ? 'Creating visual ads...' : 'Generate Visual Ads'}
                </button>
                <div className="ad-visual-grid">
                  {Object.entries(visuals).map(([platform, image]) => (
                    <figure key={platform}>
                      <img src={image} alt={`${platform} advertisement`} />
                      <figcaption>{platform.replace('_', ' / ')}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <div className="ads-box">
                <h3>Ask AI to Edit Your Ad</h3>
                <p>For example: “remove the discount”, “use a calmer background”, or “make it suitable for young families”.</p>
                <div className="ad-conversation">
                  {conversation.map((message, index) => <p key={index} className={message.role}><strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.text}</p>)}
                </div>
                <form onSubmit={handleRevision}>
                  <input value={revision} onChange={(e) => setRevision(e.target.value)} placeholder="Describe what to change or remove" />
                  <button className="copy-btn" type="submit">Apply Change</button>
                </form>
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
};

export default AdsGenerationPage;
