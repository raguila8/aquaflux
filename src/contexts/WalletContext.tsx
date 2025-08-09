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
        unsubscribe = await subscribeToWalletTransactions(address, (tx: TransactionInfo) => {
          console.log('🔔 Transaction callback received, calling notify directly like test:', tx);
          const basescanUrl = `https://basescan.org/tx/${tx.hash}`;
          
          // EXACT same as test button - direct notify calls
          if (tx.status === 'pending') {
            console.log('⚠️ Calling notify.warning directly like test button');
            notify.warning({
              title: `Sending ${tx.token}`,
              description: `${tx.value} ${tx.token} to vault${tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => window.open(basescanUrl, '_blank'),
            });
            setTimeout(refreshBalances, 1000);
          } else if (tx.status === 'confirmed' && tx.type !== 'failed') {
            console.log('✅ Calling notify.success directly like test button');
            const isDeposit = tx.type === 'deposit';
            const successAction = isDeposit ? 'Sent' : 'Received';
            
            notify.success({
              title: `${successAction} ${tx.token}!`,
              description: `${tx.value} ${tx.token} successfully ${successAction.toLowerCase()}${tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => window.open(basescanUrl, '_blank'),
            });
            refreshBalances();
          } else if (tx.type === 'failed') {
            console.log('❌ Calling notify.error directly like test button');
            notify.error({
              title: 'Transaction Failed',
              description: `10 FLUX minimum required. ${tx.value} ${tx.token} returned to wallet • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => window.open(basescanUrl, '_blank'),
            });
            refreshBalances();
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