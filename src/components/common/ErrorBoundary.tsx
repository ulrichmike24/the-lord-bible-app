import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if error is related to MetaMask or browser extension
    const msg = (error?.message || '').toLowerCase();
    const stack = (error?.stack || '').toLowerCase();
    if (
      msg.includes('metamask') ||
      msg.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      msg.includes('inpage.js') ||
      stack.includes('chrome-extension')
    ) {
      // Don't crash UI on extension noise
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = (error?.message || '').toLowerCase();
    if (
      msg.includes('metamask') ||
      msg.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      msg.includes('inpage.js')
    ) {
      // Ignore benign extension exceptions
      return;
    }
    console.warn('Application caught exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-neutral-800 bg-neutral-950 p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white text-black mx-auto flex items-center justify-center font-black text-xl">
              ✝
            </div>
            <h2 className="text-xl font-bold text-white">Bible AI</h2>
            <p className="text-xs text-neutral-400">
              Une interruption inattendue est survenue dans l'affichage. L'application peut être rechargée immédiatement.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
