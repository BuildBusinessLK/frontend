import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function fetchDocuments(token) {
  const res = await fetch(`${SPRING_BASE}/api/business-documents`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load documents');
  }
  return res.json();
}

export async function uploadDocument(token, file, category, description, businessId) {
  const formData = new FormData();
  formData.append('file', file);
  if (category) formData.append('category', category);
  if (description) formData.append('description', description);
  if (businessId) formData.append('businessId', businessId);

  const res = await fetch(`${SPRING_BASE}/api/business-documents/upload`, {
    method: 'POST',
    headers: {
      ...authHeaders(token),
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to upload document');
  }
  return data;
}

export async function deleteDocument(token, id) {
  const res = await fetch(`${SPRING_BASE}/api/business-documents/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(token),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete document');
  }
  return true;
}

export async function downloadDocument(token, id, fileName) {
  const res = await fetch(`${SPRING_BASE}/api/business-documents/${id}/download`, {
    headers: {
      ...authHeaders(token),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to download document');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'download';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
