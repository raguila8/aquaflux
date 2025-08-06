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
    
    // Inject enhanced modal styles
    const style = document.createElement('style');
    style.innerHTML = `
      /* Critical z-index fixes for Alchemy modal */
      body > div:has([role="dialog"]),
      body > div[id*="headlessui-portal"],
      body > div[id*="radix-"],
      body > div[data-overlay-container],
      #__next ~ div {
        z-index: 2147483647 !important;
        position: fixed !important;
        inset: 0 !important;
        pointer-events: auto !important;
      }
      
      /* Enhanced backdrop with blur */
      body > div:has([role="dialog"])::before {
        content: '';
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: -1;
      }
      
      /* Center modal properly */
      [role="dialog"] {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        max-width: 480px !important;
        width: 90% !important;
        background: linear-gradient(180deg, 
          rgba(9, 9, 11, 0.98) 0%, 
          rgba(18, 18, 27, 0.98) 100%) !important;
        border: 1px solid rgba(3, 201, 230, 0.3) !important;
        border-radius: 24px !important;
        padding: 32px !important;
        box-shadow: 
          0 0 100px rgba(3, 201, 230, 0.3),
          0 30px 60px -15px rgba(0, 0, 0, 0.7) !important;
      }
      
      /* Ensure body doesn't scroll when modal is open */
      body:has([role="dialog"]) {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    // Additional DOM manipulation to ensure modal appears correctly
    const checkModal = setInterval(() => {
      const modal = document.querySelector('[role="dialog"]');
      const backdrop = document.querySelector('[data-overlay-container]');
      
      if (modal) {
        const parent = modal.parentElement;
        if (parent) {
          parent.style.zIndex = '2147483647';
          parent.style.position = 'fixed';
          parent.style.inset = '0';
        }
      }
      
      if (backdrop && backdrop instanceof HTMLElement) {
        backdrop.style.zIndex = '2147483646';
      }
    }, 100);
    
    // Clean up interval after 10 seconds
    setTimeout(() => clearInterval(checkModal), 10000);
    
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