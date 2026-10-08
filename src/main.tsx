import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

// Intercept and suppress external browser extension rejections (e.g. MetaMask inpage script)
// and Vite dev HMR websocket disconnects that don't affect application runtime.
if (typeof window !== 'undefined') {
  const isIgnoredError = (reasonOrMsg: any) => {
    const text = (
      typeof reasonOrMsg === 'string'
        ? reasonOrMsg
        : (reasonOrMsg?.message || '') + ' ' + (reasonOrMsg?.stack || '') + ' ' + String(reasonOrMsg || '')
    ).toLowerCase();

    return (
      text.includes('metamask') ||
      text.includes('failed to connect to metamask') ||
      text.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      text.includes('inpage.js') ||
      text.includes('chrome-extension') ||
      text.includes('moz-extension') ||
      text.includes('ethereum') ||
      text.includes('web3') ||
      text.includes('websocket closed') ||
      text.includes('failed to connect to websocket') ||
      text.includes('could not reach cloud firestore')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isIgnoredError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (isIgnoredError(event.error || event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);


