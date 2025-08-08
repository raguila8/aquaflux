'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { getFluxBalance, getUsdcBalance } from '@/services/alchemyTokenService';
import { subscribeToWalletTransactions, unsubscribeAll, type TransactionInfo } from '@/services/alchemyWebSocketService';
import { useRouter, usePathname } from 'next/navigation';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  fluxBalance: string;
  usdcBalance: string;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
  isReady: boolean;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { address, isConnected, isConnecting, status } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { open } = useAppKit();
  const router = useRouter();
  const pathname = usePathname();
  
  const [fluxBalance, setFluxBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (status !== 'reconnecting') {
      setIsReady(true);
    }
  }, [status]);

  const refreshBalances = useCallback(async () => {
    if (!address) {
      setFluxBalance('0');
      setUsdcBalance('0');
      return;
    }

    setIsLoading(true);
    try {
      const [flux, usdc] = await Promise.all([
        getFluxBalance(address),
        getUsdcBalance(address),
      ]);
      setFluxBalance(flux);
      setUsdcBalance(usdc);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address && isReady) {
      refreshBalances();
      
      let unsubscribe: (() => void) | undefined;
      
      const setupSubscriptions = async () => {
        unsubscribe = await subscribeToWalletTransactions(address, (tx: TransactionInfo) => {
          if (tx.status === 'confirmed' || tx.type === 'failed') {
            refreshBalances();
          } else if (tx.status === 'pending') {
            setTimeout(refreshBalances, 1000);
          }
        });
      };
      
      setupSubscriptions();
      
      const interval = setInterval(refreshBalances, 30000);
      
      return () => {
        unsubscribe?.();
        clearInterval(interval);
      };
    } else {
      setFluxBalance('0');
      setUsdcBalance('0');
      unsubscribeAll();
    }
  }, [address, isReady, refreshBalances]);

  useEffect(() => {
    if (!isReady || status === 'reconnecting') return;

    if (pathname === '/' && isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, isReady, status, pathname, router]);

  const connect = useCallback(() => {
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      await wagmiDisconnect();
      setFluxBalance('0');
      setUsdcBalance('0');
      if (pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [wagmiDisconnect, router, pathname]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address: address || null,
        fluxBalance,
        usdcBalance,
        connect,
        disconnect,
        isLoading: isLoading || isConnecting,
        isReady,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}