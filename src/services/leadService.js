/**
 * Lead capture service — posts marketing-form submissions to the Menler API.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
  };
}

export async function submitLead(payload) {
  const data = {
    ...payload,
    ...getUTMParams(),
    page: window.location.pathname,
  };

  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Lead submission failed');
  return res.json();
}
