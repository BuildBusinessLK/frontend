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
  const [activeType, setActiveType] = useState('text');

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
    setVisuals({});
    setActiveType('text');

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
      setActiveType('visual');
      return data;
    } finally {
      setLoadingVisuals(false);
    }
  };

  const handleRevision = async (e) => {
    e.preventDefault();
    const instruction = revision.trim();
    if (!instruction) return;
    setConversation((items) => [...items, { role: 'user', text: instruction }]);
    setRevision('');

    if (activeType === 'visual') {
      try {
        setVisuals({}); // Clear previous visuals before regenerating
        await generateVisuals(instruction);
        setConversation((items) => [...items, { role: 'assistant', text: 'Regenerated the visual creative based on your instruction.' }]);
      } catch (err) {
        setConversation((items) => [...items, { role: 'assistant', text: err.message || 'I could not regenerate the visuals.' }]);
      }
    } else {
      if (!response?.generatedAds) return;
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
        setConversation((items) => [...items, { role: 'assistant', text: 'Updated the ad copy.' }]);
      } catch (err) {
        setConversation((items) => [...items, { role: 'assistant', text: err.message || 'I could not apply that change.' }]);
      }
    }
  };

  const extractAdForPlatform = (allAds, platform) => {
    if (!allAds) return '';
    const text = allAds.replace(/\r\n/g, '\n');
    const lines = text.split('\n');
    let platformLines = [];
    let recording = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      let isHeader = false;
      let detectedPlatform = null;

      if (line.includes('facebook') || line.includes('fb ad')) {
        isHeader = true;
        detectedPlatform = 'facebook';
      } else if (line.includes('instagram') || line.includes('ig ad') || line.includes('insta')) {
        isHeader = true;
        detectedPlatform = 'instagram';
      } else if (line.includes('tiktok')) {
        isHeader = true;
        detectedPlatform = 'tiktok';
      } else if (line.includes('whatsapp') || line.includes('wa ad')) {
        isHeader = true;
        detectedPlatform = 'whatsapp';
      } else if (line.includes('headline') || line.includes('hashtag') || (line.startsWith('---') && i > 0 && lines[i-1].trim() === '')) {
        isHeader = true;
        detectedPlatform = 'other';
      }

      if (isHeader) {
        if (detectedPlatform === platform) {
          recording = true;
          platformLines = [];
        } else {
          recording = false;
        }
        continue;
      }

      if (recording && line.startsWith('---')) {
        continue;
      }

      if (recording) {
        platformLines.push(lines[i]);
      }
    }

    const result = platformLines.join('\n').trim();
    return result || allAds;
  };

  const handleShare = (platform) => {
    const allAds = response?.generatedAds || response?.generated_ads || '';
    if (!allAds) return;

    const platformAdText = extractAdForPlatform(allAds, platform);

    navigator.clipboard.writeText(platformAdText).then(() => {
      let url = '';
      switch(platform) {
        case 'facebook':
          url = 'https://www.facebook.com/';
          break;
        case 'instagram':
          url = 'https://www.instagram.com/';
          break;
        case 'tiktok':
          url = 'https://www.tiktok.com/';
          break;
        case 'whatsapp':
          url = `https://api.whatsapp.com/send?text=${encodeURIComponent(platformAdText)}`;
          break;
        default:
          return;
      }

      alert(`Copied ${platform.charAt(0).toUpperCase() + platform.slice(1)} ad text to clipboard! Opening ${platform}...`);
      window.open(url, '_blank');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy ad text automatically. Please copy it manually.');
    });
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
              </div>

              {activeType === 'text' && (
                <div className="ads-box">
                  <h3>Ad Variations</h3>
                  <div className="ads-content-display">
                    {response.generatedAds || response.generated_ads}
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <button className="copy-btn" onClick={() => generateVisuals()} disabled={loadingVisuals}>
                      {loadingVisuals ? 'Creating visual ads...' : '🎨 Generate Visual Ads'}
                    </button>
                  </div>
                </div>
              )}

              {activeType === 'visual' && (
                <div className="ads-box">
                  <h3>Professional Visual Ads</h3>
                  <div className="ad-visual-grid">
                    {Object.entries(visuals).map(([platform, image]) => (
                      <figure key={platform}>
                        <img src={image} alt={`${platform} advertisement`} />
                        <figcaption>{platform.replace('_', ' / ')}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <button className="copy-btn" onClick={() => setActiveType('text')}>
                      📝 Switch to Text Ad
                    </button>
                  </div>
                </div>
              )}

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
