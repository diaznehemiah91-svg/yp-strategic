'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#020304',
          color: '#00ff52',
          border: '1px solid rgba(0,255,80,0.2)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          borderRadius: '6px',
          boxShadow: '0 0 20px rgba(0,255,80,0.1)',
          backdropFilter: 'blur(16px)',
        },
        success: {
          duration: 2000,
          icon: '✓',
        },
        error: {
          duration: 4000,
          icon: '✗',
          style: {
            color: '#ff3355',
            borderColor: 'rgba(255,51,85,0.2)',
          },
        },
        loading: {
          icon: '⋯',
        },
      }}
    />
  );
}
