'use client'

import { AlchemyAccountProvider } from '@account-kit/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from '@/config/alchemy';
import { WalletProvider } from '@/contexts/WalletContext';

export function AlchemyProviders({ children }: { children: React.ReactNode }) {
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