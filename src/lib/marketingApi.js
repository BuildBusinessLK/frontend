const API_BASE_URL = process.env.REACT_APP_MARKETING_API_BASE_URL || 'http://localhost:8082/api/marketing';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = data?.errors ? Object.values(data.errors).join(' ') : null;
    throw new Error(validationErrors || data?.message || 'Something went wrong while contacting the server.');
  }

  return data;
}

export async function fetchShopProfile() {
  const response = await fetch(`${API_BASE_URL}/shop-profile`);
  return parseResponse(response);
}

export async function saveShopProfile(payload) {
  const response = await fetch(`${API_BASE_URL}/shop-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function generateAd(payload) {
  const response = await fetch(`${API_BASE_URL}/ads/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}
