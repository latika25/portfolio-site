import { API_BASE_URL } from '../data/constants';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const message = body?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  getResumeGraph: () => request('/api/resume'),

  postContact: ({ name, email, message, company = '' }) =>
    request('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message, company }),
    }),

  trackView: (nodeId = '') => {
    request('/api/analytics/view', {
      method: 'POST',
      body: JSON.stringify({ nodeId, referrer: document.referrer }),
    }).catch(() => {});
  },
};
