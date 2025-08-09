'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { getFluxBalance, getUsdcBalance } from '@/services/alchemyTokenService';
import { subscribeToWalletTransactions, unsubscribeAll, type TransactionInfo } from '@/services/alchemyWebSocketService.tsx';
import { useRouter, usePathname } from 'next/navigation';
import { notify } from '@/lib/notify';

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
  const [previousConnectedState, setPreviousConnectedState] = useState<boolean>(false);
  
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
        console.log('🔧 Setting up WebSocket subscriptions for:', address);
        // Disable WebSocket notifications - using table-based notifications instead
        console.log('🔧 WebSocket monitoring disabled - using table data for notifications');
        unsubscribe = () => {}; // No-op unsubscribe function
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

  // Show connection notifications on homepage
  useEffect(() => {
    if (!isReady || status === 'reconnecting') return;
    
    // Show notification when connection status changes on homepage
    if (pathname === '/' && previousConnectedState !== isConnected) {
      if (isConnected && previousConnectedState === false) {
        notify.info({
          title: 'Wallet Connected',
          description: 'Successfully connected to your wallet'
        });
      } else if (!isConnected && previousConnectedState === true) {
        notify.info({
          title: 'Wallet Disconnected', 
          description: 'Successfully disconnected from your wallet'
        });
      }
      setPreviousConnectedState(isConnected);
    }
  }, [isConnected, isReady, status, pathname, previousConnectedState]);

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