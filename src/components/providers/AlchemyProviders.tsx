'use client'

import { AlchemyAccountProvider } from '@account-kit/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from '@/config/alchemy';
import { WalletProvider, SSRWalletProvider } from '@/contexts/WalletContext';
import { useEffect, useState } from 'react';

export function AlchemyProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Inject global styles to ensure modal appears on top and matches theme
    const style = document.createElement('style');
    style.innerHTML = `
      /* Force Alchemy modal to appear on top */
      body > div[data-rk*="modal"],
      body > div[class*="aa-"], 
      body > div[class*="alchemy"],
      body > div[class*="account-kit"],
      body > div[role="dialog"],
      wcm-modal,
      w3m-modal,
      .akui-modal-container,
      .akui-modal,
      div[data-testid*="modal"],
      div[id*="modal"] {
        z-index: 2147483647 !important;
        position: fixed !important;
      }
      
      /* Force backdrop to be visible */
      body > div[data-rk*="backdrop"],
      body > div[class*="backdrop"],
      body > div[class*="overlay"],
      .akui-modal-backdrop {
        z-index: 2147483646 !important;
        position: fixed !important;
        inset: 0 !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
        backdrop-filter: blur(8px) !important;
      }
      
      /* Dark theme for modal content */
      .akui-modal,
      .akui-modal-content,
      div[class*="account-kit"] {
        background: linear-gradient(rgba(9, 9, 11, 0.98), rgba(9, 9, 11, 0.98)) !important;
        color: #fafafa !important;
      }
      
      /* Style buttons in modal */
      .akui-button,
      button[class*="wallet"],
      button[class*="connect"] {
        background: linear-gradient(135deg, #03c9e6, #0596b5) !important;
        color: white !important;
        border: none !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
      }
      
      .akui-button:hover,
      button[class*="wallet"]:hover,
      button[class*="connect"]:hover {
        background: linear-gradient(135deg, #0596b5, #0c7792) !important;
        transform: translateY(-1px) !important;
      }
      
      /* Fix for any potential stacking context issues */
      body {
        position: relative;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // During SSR, render children with SSR provider
  if (!mounted) {
    return <SSRWalletProvider>{children}</SSRWalletProvider>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={config} queryClient={queryClient}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}