import React from 'react';
import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { toast } from 'sonner';
import { VAULT_ADDRESS, FLUX_TOKEN_ADDRESS, USDC_ADDRESS } from '@/config/constants';

// Configure Alchemy SDK
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? Network.BASE_SEPOLIA : Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

interface TransactionUpdate {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
  value: string;
  token: 'FLUX' | 'USDC' | 'ETH';
  type: 'deposit' | 'withdrawal';
  blockNumber?: number;
  confirmations?: number;
  timestamp?: string;
}

// Store active subscriptions
const activeSubscriptions = new Map<string, any>();

// Store pending transactions to track their status
const pendingTransactions = new Map<string, TransactionUpdate>();

// Callbacks for transaction updates
const transactionCallbacks = new Map<string, Set<(tx: TransactionUpdate) => void>>();

/**
 * Format token symbol from contract address
 */
function getTokenSymbol(contractAddress?: string): 'FLUX' | 'USDC' | 'ETH' {
  if (!contractAddress) return 'ETH';
  const addr = contractAddress.toLowerCase();
  if (addr === FLUX_TOKEN_ADDRESS.toLowerCase()) return 'FLUX';
  if (addr === USDC_ADDRESS.toLowerCase()) return 'USDC';
  return 'ETH';
}

/**
 * Get Basescan URL for transaction
 */
function getBasescanUrl(txHash: string): string {
  const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
  return `https://${network}basescan.org/tx/${txHash}`;
}

/**
 * Show toast notification for transaction update
 */
function showTransactionToast(tx: TransactionUpdate) {
  const isDeposit = tx.type === 'deposit';
  const action = isDeposit ? 'Deposit' : 'Withdrawal';
  const direction = isDeposit ? 'to' : 'from';
  const basescanUrl = getBasescanUrl(tx.hash);
  
  if (tx.status === 'pending') {
    toast.loading(
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{action} Pending</div>
        <div className="text-sm opacity-80">
          {tx.value} {tx.token} {direction} vault
        </div>
        <a 
          href={basescanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs opacity-60 font-mono hover:opacity-100 hover:text-blue-400 transition-colors"
        >
          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)} ↗
        </a>
      </div>,
      { 
        id: tx.hash,
        duration: Infinity 
      }
    );
  } else if (tx.status === 'confirmed') {
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{action} Confirmed!</div>
        <div className="text-sm opacity-80">
          {tx.value} {tx.token} {direction} vault
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">Block #{tx.blockNumber}</span>
          <a 
            href={basescanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs opacity-60 hover:opacity-100 hover:text-blue-400 transition-colors"
          >
            View ↗
          </a>
        </div>
      </div>,
      { 
        id: tx.hash,
        duration: 5000 
      }
    );
  } else if (tx.status === 'failed') {
    toast.error(
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{action} Failed</div>
        <div className="text-sm opacity-80">
          {tx.value} {tx.token} {direction} vault
        </div>
        <a 
          href={basescanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs opacity-60 font-mono hover:opacity-100 hover:text-red-400 transition-colors"
        >
          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)} ↗
        </a>
      </div>,
      { 
        id: tx.hash,
        duration: 5000 
      }
    );
  }
}

/**
 * Subscribe to pending transactions for a wallet address
 */
export async function subscribeToPendingTransactions(
  walletAddress: string,
  onUpdate?: (tx: TransactionUpdate) => void
): Promise<() => void> {
  const subKey = `pending_${walletAddress}`;
  
  // Add callback if provided
  if (onUpdate) {
    if (!transactionCallbacks.has(walletAddress)) {
      transactionCallbacks.set(walletAddress, new Set());
    }
    transactionCallbacks.get(walletAddress)!.add(onUpdate);
  }
  
  // If already subscribed, just return unsubscribe function
  if (activeSubscriptions.has(subKey)) {
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
    };
  }
  
  try {
    // Subscribe to pending transactions from wallet
    const fromWalletSub = alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        fromAddress: walletAddress,
        toAddress: VAULT_ADDRESS,
      },
      async (tx) => {
        const tokenAddress = tx.asset || tx.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        
        const update: TransactionUpdate = {
          hash: tx.hash,
          status: 'pending',
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString() || '0',
          token,
          type: 'deposit',
          timestamp: new Date().toISOString(),
        };
        
        pendingTransactions.set(tx.hash, update);
        showTransactionToast(update);
        
        // Notify all callbacks
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(update));
        
        // Monitor transaction confirmation
        monitorTransactionStatus(tx.hash, walletAddress);
      }
    );
    
    // Subscribe to pending transactions to wallet
    const toWalletSub = alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        fromAddress: VAULT_ADDRESS,
        toAddress: walletAddress,
      },
      async (tx) => {
        const tokenAddress = tx.asset || tx.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        
        const update: TransactionUpdate = {
          hash: tx.hash,
          status: 'pending',
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString() || '0',
          token,
          type: 'withdrawal',
          timestamp: new Date().toISOString(),
        };
        
        pendingTransactions.set(tx.hash, update);
        showTransactionToast(update);
        
        // Notify all callbacks
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(update));
        
        // Monitor transaction confirmation
        monitorTransactionStatus(tx.hash, walletAddress);
      }
    );
    
    activeSubscriptions.set(subKey, { fromWalletSub, toWalletSub });
    
    // Return unsubscribe function
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
      
      // Only unsubscribe if no more callbacks
      if (!transactionCallbacks.get(walletAddress)?.size) {
        const subs = activeSubscriptions.get(subKey);
        if (subs) {
          alchemy.ws.off(subs.fromWalletSub);
          alchemy.ws.off(subs.toWalletSub);
          activeSubscriptions.delete(subKey);
        }
        transactionCallbacks.delete(walletAddress);
      }
    };
  } catch (error) {
    console.error('Error subscribing to pending transactions:', error);
    return () => {};
  }
}

/**
 * Monitor transaction status until confirmed or failed
 */
async function monitorTransactionStatus(txHash: string, walletAddress: string) {
  try {
    let attempts = 0;
    const maxAttempts = 60; // Monitor for up to 5 minutes (5 second intervals)
    
    const checkStatus = async () => {
      attempts++;
      
      try {
        const receipt = await alchemy.core.getTransactionReceipt(txHash);
        
        if (receipt) {
          const pendingTx = pendingTransactions.get(txHash);
          if (pendingTx) {
            const update: TransactionUpdate = {
              ...pendingTx,
              status: receipt.status === 1 ? 'confirmed' : 'failed',
              blockNumber: receipt.blockNumber,
              confirmations: receipt.confirmations,
            };
            
            pendingTransactions.delete(txHash);
            showTransactionToast(update);
            
            // Notify all callbacks
            transactionCallbacks.get(walletAddress)?.forEach(cb => cb(update));
          }
          return true; // Transaction finalized
        }
        
        // Continue monitoring if not finalized and under max attempts
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        } else {
          // Timeout - mark as failed
          const pendingTx = pendingTransactions.get(txHash);
          if (pendingTx) {
            const update: TransactionUpdate = {
              ...pendingTx,
              status: 'failed',
            };
            
            pendingTransactions.delete(txHash);
            showTransactionToast(update);
            
            // Notify all callbacks
            transactionCallbacks.get(walletAddress)?.forEach(cb => cb(update));
          }
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        }
      }
    };
    
    // Start monitoring after a short delay
    setTimeout(checkStatus, 3000);
  } catch (error) {
    console.error('Error monitoring transaction:', error);
  }
}

/**
 * Subscribe to mined transactions (confirmed transactions in new blocks)
 */
export async function subscribeToMinedTransactions(
  walletAddress: string,
  onUpdate?: (tx: TransactionUpdate) => void
): Promise<() => void> {
  const subKey = `mined_${walletAddress}`;
  
  // Add callback if provided
  if (onUpdate) {
    if (!transactionCallbacks.has(walletAddress)) {
      transactionCallbacks.set(walletAddress, new Set());
    }
    transactionCallbacks.get(walletAddress)!.add(onUpdate);
  }
  
  // If already subscribed, just return unsubscribe function
  if (activeSubscriptions.has(subKey)) {
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
    };
  }
  
  try {
    // Subscribe to mined transactions
    const minedSub = alchemy.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
          { from: walletAddress, to: VAULT_ADDRESS },
          { from: VAULT_ADDRESS, to: walletAddress },
        ],
      },
      async (tx) => {
        const isDeposit = tx.transaction.to?.toLowerCase() === VAULT_ADDRESS.toLowerCase();
        const tokenAddress = tx.transaction.asset || tx.transaction.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        
        const update: TransactionUpdate = {
          hash: tx.transaction.hash,
          status: 'confirmed',
          from: tx.transaction.from,
          to: tx.transaction.to || '',
          value: tx.transaction.value?.toString() || '0',
          token,
          type: isDeposit ? 'deposit' : 'withdrawal',
          blockNumber: tx.transaction.blockNumber,
          timestamp: new Date().toISOString(),
        };
        
        // Only show toast if this wasn't a pending transaction we were tracking
        if (!pendingTransactions.has(tx.transaction.hash)) {
          showTransactionToast(update);
        }
        
        // Notify all callbacks
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(update));
      }
    );
    
    activeSubscriptions.set(subKey, minedSub);
    
    // Return unsubscribe function
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
      
      // Only unsubscribe if no more callbacks
      if (!transactionCallbacks.get(walletAddress)?.size) {
        const sub = activeSubscriptions.get(subKey);
        if (sub) {
          alchemy.ws.off(sub);
          activeSubscriptions.delete(subKey);
        }
        transactionCallbacks.delete(walletAddress);
      }
    };
  } catch (error) {
    console.error('Error subscribing to mined transactions:', error);
    return () => {};
  }
}

/**
 * Get all pending transactions for a wallet
 */
export function getPendingTransactions(walletAddress: string): TransactionUpdate[] {
  const pending: TransactionUpdate[] = [];
  
  pendingTransactions.forEach((tx) => {
    if (tx.from === walletAddress || tx.to === walletAddress) {
      pending.push(tx);
    }
  });
  
  return pending;
}

/**
 * Unsubscribe from all active subscriptions
 */
export function unsubscribeAll() {
  activeSubscriptions.forEach((sub, key) => {
    if (key.startsWith('mined_')) {
      alchemy.ws.off(sub);
    } else if (key.startsWith('pending_')) {
      alchemy.ws.off(sub.fromWalletSub);
      alchemy.ws.off(sub.toWalletSub);
    }
  });
  
  activeSubscriptions.clear();
  transactionCallbacks.clear();
  pendingTransactions.clear();
}

/**
 * Get Alchemy SDK instance for direct use
 */
export function getAlchemyInstance() {
  return alchemy;
}