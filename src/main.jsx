import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// After a new deploy, a tab holding the old index.html may request JS chunks
// whose hashes no longer exist → they 404 and the page goes blank. Vite fires
// `vite:preloadError` in that case — reload once (guarded) to fetch the fresh
// build instead of white-screening.
window.addEventListener('vite:preloadError', () => {
  const last = Number(sessionStorage.getItem('preload-reload-at') || 0);
  if (Date.now() - last > 10000) {
    sessionStorage.setItem('preload-reload-at', String(Date.now()));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

// Dismiss the instant loading screen once React has painted the first frame.
requestAnimationFrame(() => requestAnimationFrame(() => {
  const l = document.getElementById('app-loader');
  if (l) { l.classList.add('hide'); setTimeout(() => l.remove(), 400); }
}));
