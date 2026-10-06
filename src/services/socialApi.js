import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const generateSocialPost = async (token, payload, generateImage = true) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/social/generate?generateImage=${generateImage}`,
    payload,
    authHeaders(token)
  );
  return response.data;
};

export const getSocialPostHistory = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/social/posts`, authHeaders(token));
  return response.data;
};

export const updateSocialPost = async (token, postId, updatedData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/social/posts/${postId}`,
    updatedData,
    authHeaders(token)
  );
  return response.data;
};

export const getInstagramStatus = async (token) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/social/instagram/status`,
    authHeaders(token)
  );
  return response.data;
};

export const getInstagramConnectUrl = async (token) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/social/instagram/connect`,
    authHeaders(token)
  );
  return response.data?.url;
};

export const connectInstagramWithToken = async (token, tokenPayload) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/social/instagram/connect-token`,
    tokenPayload,
    authHeaders(token)
  );
  return response.data;
};

export const disconnectInstagram = async (token) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/social/instagram/disconnect`,
    authHeaders(token)
  );
  return response.data;
};

export const publishToInstagram = async (token, { postId, caption, imageUrl }) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/social/instagram/publish`,
    { postId, caption, imageUrl },
    authHeaders(token)
  );
  return response.data;
};

export const publishToFacebook = async (token, { postId, caption, imageUrl }) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/social/facebook/publish`,
    { postId, caption, imageUrl },
    authHeaders(token)
  );
  return response.data;
};
