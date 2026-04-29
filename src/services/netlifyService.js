/**
 * Netlify API Service
 * Handles authentication and automatic deployment to Netlify
 */

const NETLIFY_API_URL = 'https://api.netlify.com/api/v1';
const NETLIFY_AUTH_URL = 'https://app.netlify.com/authorize';

// OAuth configuration
const OAUTH_CONFIG = {
  client_id: process.env.REACT_APP_NETLIFY_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
  redirect_uri: `${window.location.origin}/netlify-callback`,
  response_type: 'token',
  scope: 'deploy',
};

/**
 * Get Netlify auth token from localStorage
 */
export const getNetlifyToken = () => {
  return localStorage.getItem('netlify_token');
};

/**
 * Set Netlify auth token
 */
export const setNetlifyToken = (token) => {
  localStorage.setItem('netlify_token', token);
};

/**
 * Clear Netlify auth token
 */
export const clearNetlifyToken = () => {
  localStorage.removeItem('netlify_token');
};

/**
 * Check if user is authenticated with Netlify
 */
export const isNetlifyAuthenticated = () => {
  return !!getNetlifyToken();
};

/**
 * Get Netlify authorization URL for OAuth flow
 */
export const getNetlifyAuthUrl = () => {
  const params = new URLSearchParams(OAUTH_CONFIG).toString();
  return `${NETLIFY_AUTH_URL}?${params}`;
};

/**
 * Get user's Netlify profile
 */
export const getNetlifyUser = async () => {
  const token = getNetlifyToken();
  if (!token) throw new Error('Not authenticated with Netlify');

  try {
    const response = await fetch(`${NETLIFY_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearNetlifyToken();
        throw new Error('Netlify token expired');
      }
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching Netlify user:', err);
    throw err;
  }
};

/**
 * Get user's Netlify sites
 */
export const getNetlifySites = async () => {
  const token = getNetlifyToken();
  if (!token) throw new Error('Not authenticated with Netlify');

  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sites');
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching Netlify sites:', err);
    throw err;
  }
};

/**
 * Create a new site and deploy files
 * @param {string} siteName - Name for the new site
 * @param {Object} files - { 'index.html': '...', 'style.css': '...', 'script.js': '...' }
 * @param {Function} onProgress - Callback for progress updates
 */
export const deployToNetlify = async (siteName, files, onProgress = null) => {
  const token = getNetlifyToken();
  if (!token) throw new Error('Not authenticated with Netlify');

  try {
    // Step 1: Create a new site
    onProgress?.({ status: 'creating', message: 'Creating new site...' });

    const siteResponse = await fetch(`${NETLIFY_API_URL}/sites`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizeSiteName(siteName),
      }),
    });

    if (!siteResponse.ok) {
      throw new Error(`Failed to create site: ${siteResponse.statusText}`);
    }

    const site = await siteResponse.json();
    const siteId = site.id;

    // Step 2: Prepare files for deployment
    onProgress?.({ status: 'preparing', message: 'Preparing files...' });

    const filesByteMap = await prepareFilesForDeployment(files);

    // Step 3: Create deployment
    onProgress?.({ status: 'uploading', message: 'Uploading files...' });

    const deployResponse = await fetch(
      `${NETLIFY_API_URL}/sites/${siteId}/deploys`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filesByteMap,
        }),
      }
    );

    if (!deployResponse.ok) {
      throw new Error(`Failed to create deployment: ${deployResponse.statusText}`);
    }

    const deploy = await deployResponse.json();
    const deployId = deploy.id;

    // Step 4: Upload files
    onProgress?.({ status: 'deploying', message: 'Deploying to Netlify...' });

    // For each file, upload it
    for (const [filename, content] of Object.entries(files)) {
      const fileHash = deploy.files[filename];
      
      if (fileHash) {
        await uploadFileToDeployment(
          siteId,
          deployId,
          fileHash,
          content,
          filename
        );
      }
    }

    // Step 5: Finalize deployment
    onProgress?.({ status: 'finalizing', message: 'Finalizing deployment...' });

    const finalizeResponse = await fetch(
      `${NETLIFY_API_URL}/sites/${siteId}/deploys/${deployId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!finalizeResponse.ok) {
      throw new Error('Failed to finalize deployment');
    }

    const finalDeploy = await finalizeResponse.json();

    onProgress?.({
      status: 'success',
      message: 'Deployment successful!',
      deploy: finalDeploy,
      site: site,
    });

    return {
      site,
      deploy: finalDeploy,
      url: `https://${site.url}`,
    };
  } catch (err) {
    onProgress?.({
      status: 'error',
      message: err.message,
      error: err,
    });
    throw err;
  }
};

/**
 * Upload individual file to deployment
 */
const uploadFileToDeployment = async (
  siteId,
  deployId,
  fileHash,
  content,
  filename
) => {
  const token = getNetlifyToken();

  // Convert content to blob if it's a string
  let blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: getFileType(filename) });
  } else {
    blob = content;
  }

  try {
    const uploadUrl = `${NETLIFY_API_URL}/sites/${siteId}/deploys/${deployId}/files/${filename}`;

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': getFileType(filename),
      },
      body: blob,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${filename}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Error uploading ${filename}:`, err);
    throw err;
  }
};

/**
 * Deploy to existing site
 */
export const deployToExistingSite = async (siteId, files, onProgress = null) => {
  const token = getNetlifyToken();
  if (!token) throw new Error('Not authenticated with Netlify');

  try {
    onProgress?.({ status: 'preparing', message: 'Preparing files...' });

    const filesByteMap = await prepareFilesForDeployment(files);

    onProgress?.({ status: 'uploading', message: 'Uploading files...' });

    // Create deployment
    const deployResponse = await fetch(
      `${NETLIFY_API_URL}/sites/${siteId}/deploys`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filesByteMap,
        }),
      }
    );

    if (!deployResponse.ok) {
      throw new Error('Failed to create deployment');
    }

    const deploy = await deployResponse.json();

    onProgress?.({ status: 'success', message: 'Deployed successfully!' });

    return deploy;
  } catch (err) {
    onProgress?.({ status: 'error', message: err.message, error: err });
    throw err;
  }
};

/**
 * Prepare files for deployment by calculating hashes
 */
const prepareFilesForDeployment = async (files) => {
  const filesByteMap = {};

  for (const [filename, content] of Object.entries(files)) {
    const blob = new Blob([content], { type: getFileType(filename) });
    const buffer = await blob.arrayBuffer();
    const hash = await calculateSHA1(buffer);

    filesByteMap[filename] = {
      sha: hash,
      size: buffer.byteLength,
    };
  }

  return filesByteMap;
};

/**
 * Calculate SHA1 hash of data
 */
const calculateSHA1 = async (buffer) => {
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Get MIME type for file
 */
const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
};

/**
 * Sanitize site name for Netlify
 */
const sanitizeSiteName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 32);
};

export default {
  getNetlifyToken,
  setNetlifyToken,
  clearNetlifyToken,
  isNetlifyAuthenticated,
  getNetlifyAuthUrl,
  getNetlifyUser,
  getNetlifySites,
  deployToNetlify,
  deployToExistingSite,
};
