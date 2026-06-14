import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// PDF.js needs a worker; Vite bundles this URL for us.
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Renders a PDF inline by drawing each page to a <canvas>. Unlike an <iframe>,
 * this works on mobile browsers (which refuse to render PDFs in iframes and
 * instead bounce the user to a full-screen native viewer). The container
 * scrolls through the pages within the page itself.
 */
export default function PdfView({ url, className = '' }) {
  const pagesRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    const container = pagesRef.current;
    if (container) container.innerHTML = '';
    setStatus('loading');

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        const cssWidth = (container && container.clientWidth) || 600;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (cssWidth / base.width) * dpr });
          const canvas = document.createElement('canvas');
          canvas.className = 'pdfview-page';
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          container.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          if (cancelled) return;
        }
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  return (
    <div className={`pdfview ${className}`}>
      <div ref={pagesRef} className="pdfview-pages" />
      {status === 'loading' && <p className="pdfview-msg">Loading document…</p>}
      {status === 'error' && <p className="pdfview-msg">Couldn’t load the document.</p>}
    </div>
  );
}
