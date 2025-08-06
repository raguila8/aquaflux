'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { getFluxBalance, getUsdcBalance } from '@/services/alchemyTokenService';
import { subscribeToNewTransactions } from '@/services/alchemyTransactionService';
import { useRouter } from 'next/navigation';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  fluxBalance: string;
  usdcBalance: string;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { open } = useAppKit();
  const router = useRouter();
  
  const [fluxBalance, setFluxBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

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
      
      setFluxBalance(parseFloat(flux).toFixed(2));
      setUsdcBalance(parseFloat(usdc).toFixed(2));
    } catch (error) {
      console.error('Error fetching balances:', error);
      setFluxBalance('0');
      setUsdcBalance('0');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      refreshBalances();
      
      const unsubscribe = subscribeToNewTransactions((tx) => {
        if (tx.from === address || tx.to === address) {
          setTimeout(refreshBalances, 2000);
        }
      });
      
      const interval = setInterval(refreshBalances, 30000);
      
      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    } else {
      setFluxBalance('0');
      setUsdcBalance('0');
    }
  }, [address, refreshBalances]);

  useEffect(() => {
    if (!isConnected && mounted) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/dashboard')) {
        router.push('/');
      }
      // Clear the redirect flag when disconnected
      sessionStorage.removeItem('wallet_connection_redirected');
    } else if (isConnected && mounted) {
      // Redirect to dashboard after successful connection (only once per session)
      const hasRedirected = sessionStorage.getItem('wallet_connection_redirected');
      if (!hasRedirected) {
        sessionStorage.setItem('wallet_connection_redirected', 'true');
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
          router.push('/dashboard');
        }
      }
    }
  }, [isConnected, mounted, router]);

  const connect = useCallback(() => {
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      await wagmiDisconnect();
      setFluxBalance('0');
      setUsdcBalance('0');
      // Only redirect if currently on dashboard pages
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/dashboard')) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [wagmiDisconnect, router]);

  if (!mounted) {
    return (
      <WalletContext.Provider
        value={{
          isConnected: false,
          address: null,
          fluxBalance: '0',
          usdcBalance: '0',
          connect: () => {},
          disconnect: async () => {},
          isLoading: false,
          refreshBalances: async () => {},
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }
  
  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address: address || null,
        fluxBalance,
        usdcBalance,
        connect,
        disconnect,
        isLoading: isConnecting || isLoading,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}