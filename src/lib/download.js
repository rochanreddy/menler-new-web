// Trigger a direct browser download of a same-origin file (no new tab, no form,
// no verification). The `download` attribute forces a save for same-origin URLs
// (our PDFs live under /public/pdfs, served from the same origin).
export function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = encodeURI(url);
  if (filename) a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
