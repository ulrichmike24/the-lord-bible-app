import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and suppress external browser extension rejections (e.g. MetaMask inpage script)
// and Vite dev HMR websocket disconnects that don't affect application runtime.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (
      typeof reason === 'string'
        ? reason
        : (reason?.message || reason?.stack || String(reason || ''))
    ).toLowerCase();

    if (
      msg.includes('metamask') ||
      msg.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      msg.includes('ethereum') ||
      msg.includes('websocket closed') ||
      msg.includes('failed to connect to websocket') ||
      msg.includes('could not reach cloud firestore') ||
      msg.includes('firestore')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = (event.message || '').toLowerCase();
    if (
      msg.includes('metamask') ||
      msg.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      msg.includes('websocket closed') ||
      msg.includes('failed to connect to websocket') ||
      msg.includes('could not reach cloud firestore')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);

