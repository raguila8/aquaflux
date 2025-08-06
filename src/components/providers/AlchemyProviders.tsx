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