'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useSignMessage, useAuthModal, useLogout } from '@account-kit/react';
import { getFluxBalance, getUsdcBalance } from '@/services/alchemyTokenService';
import { subscribeToNewTransactions } from '@/services/alchemyTransactionService';

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
  const { address, isLoadingAccount } = useAccount({ type: "LightAccount" });
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
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
      
      // Subscribe to new transactions
      const unsubscribe = subscribeToNewTransactions((tx) => {
        // Check if transaction involves the user's wallet
        if (tx.from === address || tx.to === address) {
          // Refresh balances when new transaction is detected
          setTimeout(refreshBalances, 2000); // Wait 2 seconds for confirmation
        }
      });
      
      // Set up periodic refresh every 30 seconds
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

  const connect = () => {
    openAuthModal();
  };

  const disconnect = async () => {
    try {
      await logout();
      setFluxBalance('0');
      setUsdcBalance('0');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Return default values during SSR
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
        isConnected: !!address,
        address: address || null,
        fluxBalance,
        usdcBalance,
        connect,
        disconnect,
        isLoading: isLoadingAccount || isLoading,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// SSR Provider for server-side rendering
export function SSRWalletProvider({ children }: { children: React.ReactNode }) {
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

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}