'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useSignMessage, useAuthModal, useLogout } from '@account-kit/react';
import { ethers } from 'ethers';
import { FLUX_TOKEN_ADDRESS, ALCHEMY_RPC_URL, config } from '@/config/alchemy';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  fluxBalance: string;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const FLUX_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isLoadingAccount } = useAccount({ config });
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout({ config });
  const [fluxBalance, setFluxBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  const fetchFluxBalance = async (walletAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
      const fluxContract = new ethers.Contract(FLUX_TOKEN_ADDRESS, FLUX_ABI, provider);
      
      const balance = await fluxContract.balanceOf(walletAddress);
      const decimals = await fluxContract.decimals();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      
      setFluxBalance(parseFloat(formattedBalance).toFixed(2));
    } catch (error) {
      console.error('Error fetching FLUX balance:', error);
      setFluxBalance('0');
    }
  };

  useEffect(() => {
    if (address) {
      fetchFluxBalance(address);
      
      const provider = new ethers.WebSocketProvider(`wss://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ"}`);
      const fluxContract = new ethers.Contract(FLUX_TOKEN_ADDRESS, FLUX_ABI, provider);
      
      const handleTransfer = async (from: string, to: string) => {
        if (from === address || to === address) {
          await fetchFluxBalance(address);
        }
      };
      
      fluxContract.on('Transfer', handleTransfer);
      
      return () => {
        fluxContract.off('Transfer', handleTransfer);
        provider.destroy();
      };
    } else {
      setFluxBalance('0');
    }
  }, [address]);

  const connect = () => {
    openAuthModal();
  };

  const disconnect = async () => {
    try {
      await logout();
      setFluxBalance('0');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected: !!address,
        address: address || null,
        fluxBalance,
        connect,
        disconnect,
        isLoading: isLoadingAccount || isLoading,
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