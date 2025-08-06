'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { getFluxBalance, getUsdcBalance } from '@/services/alchemyTokenService';
import { subscribeToPendingTransactions, subscribeToMinedTransactions } from '@/services/alchemyRealtimeService';
import { useRouter } from 'next/navigation';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  fluxBalance: string;
  usdcBalance: string;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
  isHydrated: boolean;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { open } = useAppKit();
  const router = useRouter();
  
  const [fluxBalance, setFluxBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Allow time for proper hydration and wallet state initialization
    const hydrationTimer = setTimeout(() => {
      setIsHydrated(true);
    }, 2000); // Wait 2 seconds for full hydration
    
    return () => clearTimeout(hydrationTimer);
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
      setFluxBalance(flux);
      setUsdcBalance(usdc);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address && mounted) {
      refreshBalances();
      
      let unsubscribePending: (() => void) | undefined;
      let unsubscribeMined: (() => void) | undefined;
      
      // Subscribe to real-time transactions
      const setupSubscriptions = async () => {
        unsubscribePending = await subscribeToPendingTransactions(address, () => {
          // Refresh balances when new transaction is detected
          setTimeout(refreshBalances, 1000);
        });
        
        unsubscribeMined = await subscribeToMinedTransactions(address, () => {
          // Refresh balances when transaction is confirmed
          refreshBalances();
        });
      };
      
      setupSubscriptions();
      
      const interval = setInterval(refreshBalances, 30000);
      
      return () => {
        unsubscribePending?.();
        unsubscribeMined?.();
        clearInterval(interval);
      };
    } else {
      setFluxBalance('0');
      setUsdcBalance('0');
    }
  }, [address, mounted, refreshBalances]);

  useEffect(() => {
    if (!mounted || !isHydrated) return;

    // Only process redirects after hydration is complete and wallet state is stable
    const timeout = setTimeout(() => {
      if (!isConnected && !isConnecting) {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/dashboard')) {
          console.log('Wallet not connected, redirecting to homepage');
          router.push('/');
        }
        sessionStorage.removeItem('wallet_connection_redirected');
      } else if (isConnected) {
        const hasRedirected = sessionStorage.getItem('wallet_connection_redirected');
        if (!hasRedirected) {
          sessionStorage.setItem('wallet_connection_redirected', 'true');
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '') {
            console.log('Wallet connected, redirecting to dashboard');
            router.push('/dashboard');
          }
        }
      }
    }, 1000); // Additional 1 second wait after hydration

    return () => clearTimeout(timeout);
  }, [isConnected, isConnecting, mounted, isHydrated, router]);

  const connect = useCallback(() => {
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      await wagmiDisconnect();
      setFluxBalance('0');
      setUsdcBalance('0');
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
          isLoading: true,
          isHydrated: false,
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
        isLoading: isLoading || isConnecting || !isHydrated,
        isHydrated,
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