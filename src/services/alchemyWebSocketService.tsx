import React from 'react';
import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { toast } from 'sonner';
import { IconNotification } from '@/components/application/notifications/notifications';
import { VAULT_ADDRESS, FLUX_TOKEN_ADDRESS, USDC_ADDRESS, ALCHEMY_API_KEY, ALCHEMY_WS_URL } from '@/config/constants';

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
  webSocketUrl: ALCHEMY_WS_URL,
};

const alchemy = new Alchemy(settings);

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string;
  value: string;
  token: 'FLUX' | 'USDC' | 'ETH';
  type: 'deposit' | 'withdrawal' | 'failed';
  status: 'pending' | 'confirmed' | 'failed';
  fee: string;
  blockNumber?: number;
  timestamp: string;
}

interface PendingTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  token: 'FLUX' | 'USDC' | 'ETH';
  timestamp: number;
  isRefund?: boolean;
}

const activeSubscriptions = new Map<string, any>();
const pendingTransactions = new Map<string, PendingTransaction>();
const refundedTransactions = new Set<string>();
const transactionCallbacks = new Map<string, Set<(tx: TransactionInfo) => void>>();

let refundCheckInterval: NodeJS.Timeout | null = null;

function getTokenSymbol(contractAddress?: string): 'FLUX' | 'USDC' | 'ETH' {
  if (!contractAddress) return 'ETH';
  const addr = contractAddress.toLowerCase();
  if (addr === FLUX_TOKEN_ADDRESS.toLowerCase()) return 'FLUX';
  if (addr === USDC_ADDRESS.toLowerCase()) return 'USDC';
  return 'ETH';
}

function getBasescanUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

function formatTokenAmount(value: string, decimals: number = 18): string {
  const num = parseFloat(value) / Math.pow(10, decimals);
  return num.toFixed(2);
}

function checkForRefund(userAddress: string, originalTx: PendingTransaction) {
  const checkTime = Date.now();
  const timeDiff = checkTime - originalTx.timestamp;
  
  if (timeDiff > 5000 && timeDiff < 60000) {
    const refundTx = Array.from(pendingTransactions.values()).find(tx => {
      return tx.from === VAULT_ADDRESS &&
             tx.to === userAddress &&
             tx.token === originalTx.token &&
             tx.value === originalTx.value &&
             Math.abs(tx.timestamp - originalTx.timestamp) < 10000 &&
             !tx.isRefund;
    });
    
    if (refundTx) {
      refundedTransactions.add(originalTx.hash);
      refundedTransactions.add(refundTx.hash);
      
      const fluxAmount = parseFloat(originalTx.value) / 1e18;
      const reason = originalTx.token === 'USDC' && fluxAmount < 10 
        ? 'not buying at least 10 FLUX' 
        : 'transaction validation failed';
      
      toast.custom((t) => (
        <IconNotification
          title='Transaction Failed'
          description={`Failed due to ${reason}. ${formatTokenAmount(originalTx.value, originalTx.token === 'USDC' ? 6 : 18)} ${originalTx.token} returned • ${originalTx.hash.slice(0, 10)}...${originalTx.hash.slice(-8)}`}
          color='error'
          confirmLabel='View on Basescan'
          onClose={() => toast.dismiss(t)}
          onConfirm={() => {
            window.open(getBasescanUrl(originalTx.hash), '_blank');
            toast.dismiss(t);
          }}
        />
      ));
      
      const failedTx: TransactionInfo = {
        hash: originalTx.hash,
        from: originalTx.from,
        to: originalTx.to,
        value: formatTokenAmount(originalTx.value, originalTx.token === 'USDC' ? 6 : 18),
        token: originalTx.token,
        type: 'failed',
        status: 'failed',
        fee: '0',
        timestamp: new Date().toISOString(),
      };
      
      transactionCallbacks.get(userAddress)?.forEach(cb => cb(failedTx));
      
      pendingTransactions.delete(originalTx.hash);
      pendingTransactions.delete(refundTx.hash);
      
      return true;
    }
  }
  
  return false;
}

function showTransactionToast(tx: TransactionInfo, userAddress: string) {
  const isDeposit = tx.from.toLowerCase() === userAddress.toLowerCase();
  const action = isDeposit ? 'Sending' : 'Receiving';
  const direction = isDeposit ? 'to' : 'from';
  const basescanUrl = getBasescanUrl(tx.hash);
  
  if (refundedTransactions.has(tx.hash)) {
    return;
  }
  
  if (tx.status === 'pending') {
    // Immediate notification when transaction is detected
    toast.custom((t) => (
      <IconNotification
        title={`${action} ${tx.token}`}
        description={`${tx.value} ${tx.token} ${direction} vault${isDeposit && tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`}
        color='brand'
        confirmLabel='View on Basescan'
        onClose={() => toast.dismiss(t)}
        onConfirm={() => {
          window.open(basescanUrl, '_blank');
          toast.dismiss(t);
        }}
      />
    ), { id: tx.hash });
  } else if (tx.status === 'confirmed' && tx.type !== 'failed') {
    const isDeposit = tx.type === 'deposit';
    const successAction = isDeposit ? 'Sent' : 'Received';
    
    toast.dismiss(tx.hash); // Dismiss the pending toast
    toast.custom((t) => (
      <IconNotification
        title={`${successAction} ${tx.token}!`}
        description={`${tx.value} ${tx.token} successfully ${successAction.toLowerCase()}${tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`}
        color='success'
        confirmLabel='View on Basescan'
        onClose={() => toast.dismiss(t)}
        onConfirm={() => {
          window.open(basescanUrl, '_blank');
          toast.dismiss(t);
        }}
      />
    ));
  }
}

export async function subscribeToWalletTransactions(
  walletAddress: string,
  onUpdate?: (tx: TransactionInfo) => void
): Promise<() => void> {
  const subKey = `wallet_${walletAddress}`;
  
  if (onUpdate) {
    if (!transactionCallbacks.has(walletAddress)) {
      transactionCallbacks.set(walletAddress, new Set());
    }
    transactionCallbacks.get(walletAddress)!.add(onUpdate);
  }
  
  if (activeSubscriptions.has(subKey)) {
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
    };
  }
  
  try {
    console.log('🔌 Connecting to Alchemy WebSocket for wallet:', walletAddress);
    
    // Show connection toast
    toast.custom((t) => (
      <IconNotification
        title='WebSocket Connected'
        description={`Monitoring ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} for USDC and FLUX transactions`}
        color='brand'
        onClose={() => toast.dismiss(t)}
      />
    ), { duration: 3000 });
    
    const depositSub = alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        fromAddress: walletAddress,
        toAddress: VAULT_ADDRESS,
      },
      async (tx) => {
        console.log('📤 Detected outgoing transaction:', {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          asset: tx.asset,
          rawContract: tx.rawContract?.address
        });
        
        const tokenAddress = tx.asset || tx.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        const decimals = token === 'USDC' ? 6 : 18;
        const value = formatTokenAmount(tx.value?.toString() || '0', decimals);
        const fee = (parseFloat(value) * 0.01).toFixed(4);
        
        const pendingTx: PendingTransaction = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString() || '0',
          token,
          timestamp: Date.now(),
        };
        
        pendingTransactions.set(tx.hash, pendingTx);
        
        const txInfo: TransactionInfo = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value,
          token,
          type: 'deposit',
          status: 'pending',
          fee,
          timestamp: new Date().toISOString(),
        };
        
        showTransactionToast(txInfo, walletAddress);
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
        
        setTimeout(() => {
          if (!checkForRefund(walletAddress, pendingTx)) {
            monitorTransactionStatus(tx.hash, walletAddress, 'deposit');
          }
        }, 5000);
      }
    );
    
    const withdrawalSub = alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        fromAddress: VAULT_ADDRESS,
        toAddress: walletAddress,
      },
      async (tx) => {
        console.log('📥 Detected incoming transaction from vault:', {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          asset: tx.asset,
          rawContract: tx.rawContract?.address
        });
        
        const tokenAddress = tx.asset || tx.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        const decimals = token === 'USDC' ? 6 : 18;
        const value = formatTokenAmount(tx.value?.toString() || '0', decimals);
        
        const pendingTx: PendingTransaction = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString() || '0',
          token,
          timestamp: Date.now(),
        };
        
        pendingTransactions.set(tx.hash, pendingTx);
        
        const txInfo: TransactionInfo = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value,
          token,
          type: 'withdrawal',
          status: 'pending',
          fee: '0',
          timestamp: new Date().toISOString(),
        };
        
        showTransactionToast(txInfo, walletAddress);
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
        
        monitorTransactionStatus(tx.hash, walletAddress, 'withdrawal');
      }
    );
    
    // Subscribe to ALL incoming FLUX transactions (including minted tokens)
    // Using PENDING_TRANSACTIONS to catch all transactions to the wallet
    const fluxIncomingSub = alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        toAddress: walletAddress,
      },
      async (tx) => {
        // Check if this is a FLUX token transaction by examining the contract address
        const tokenAddress = tx.asset || tx.rawContract?.address || (tx.rawContract?.rawData ? tx.rawContract.rawData.to : null);
        
        // Also check if it's a FLUX transfer by looking at the 'to' field in rawContract
        const isFluxTransfer = tokenAddress && tokenAddress.toLowerCase() === FLUX_TOKEN_ADDRESS.toLowerCase();
        
        if (isFluxTransfer) {
          // Skip if already handled by vault withdrawal subscription
          if (tx.from.toLowerCase() === VAULT_ADDRESS.toLowerCase()) {
            return;
          }
          
          console.log('💰 Detected incoming FLUX transaction:', {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            asset: tx.asset,
            rawContract: tx.rawContract,
            tokenAddress: tokenAddress,
            isMinted: tx.from === '0x0000000000000000000000000000000000000000'
          });
          
          const value = formatTokenAmount(tx.value?.toString() || '0', 18);
          const isMinted = tx.from === '0x0000000000000000000000000000000000000000';
          
          const pendingTx: PendingTransaction = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value?.toString() || '0',
            token: 'FLUX',
            timestamp: Date.now(),
          };
          
          pendingTransactions.set(tx.hash, pendingTx);
          
          const txInfo: TransactionInfo = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value,
            token: 'FLUX',
            type: 'withdrawal',
            status: 'pending',
            fee: '0',
            timestamp: new Date().toISOString(),
          };
          
          // Show special notification for minted FLUX
          if (isMinted) {
            toast.custom((t) => (
              <IconNotification
                title='FLUX Minted!'
                description={`Receiving ${value} newly minted FLUX tokens • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`}
                color='success'
                confirmLabel='View on Basescan'
                onClose={() => toast.dismiss(t)}
                onConfirm={() => {
                  window.open(getBasescanUrl(tx.hash), '_blank');
                  toast.dismiss(t);
                }}
              />
            ));
          } else {
            showTransactionToast(txInfo, walletAddress);
          }
          
          transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
          monitorTransactionStatus(tx.hash, walletAddress, 'withdrawal');
        }
      }
    );
    
    // Subscribe to mined transactions for all relevant addresses
    const minedSub = alchemy.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
          { from: walletAddress, to: VAULT_ADDRESS },
          { from: VAULT_ADDRESS, to: walletAddress },
        ],
      },
      async (tx) => {
        if (refundedTransactions.has(tx.transaction.hash)) {
          return;
        }
        
        const isDeposit = tx.transaction.from.toLowerCase() === walletAddress.toLowerCase();
        const tokenAddress = tx.transaction.asset || tx.transaction.rawContract?.address;
        const token = getTokenSymbol(tokenAddress);
        const decimals = token === 'USDC' ? 6 : 18;
        const value = formatTokenAmount(tx.transaction.value?.toString() || '0', decimals);
        const fee = isDeposit ? (parseFloat(value) * 0.01).toFixed(4) : '0';
        
        const txInfo: TransactionInfo = {
          hash: tx.transaction.hash,
          from: tx.transaction.from,
          to: tx.transaction.to || '',
          value,
          token,
          type: isDeposit ? 'deposit' : 'withdrawal',
          status: 'confirmed',
          fee,
          blockNumber: tx.transaction.blockNumber,
          timestamp: new Date().toISOString(),
        };
        
        if (!pendingTransactions.has(tx.transaction.hash)) {
          showTransactionToast(txInfo, walletAddress);
        } else {
          // Transaction was pending, now confirmed
          showTransactionToast(txInfo, walletAddress);
          pendingTransactions.delete(tx.transaction.hash);
        }
        
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
      }
    );
    
    activeSubscriptions.set(subKey, { depositSub, withdrawalSub, fluxIncomingSub, minedSub });
    
    if (!refundCheckInterval) {
      refundCheckInterval = setInterval(() => {
        const now = Date.now();
        pendingTransactions.forEach((tx, hash) => {
          if (now - tx.timestamp > 60000) {
            pendingTransactions.delete(hash);
          }
        });
        
        refundedTransactions.forEach(hash => {
          const tx = pendingTransactions.get(hash);
          if (!tx || now - tx.timestamp > 300000) {
            refundedTransactions.delete(hash);
          }
        });
      }, 30000);
    }
    
    return () => {
      if (onUpdate) {
        transactionCallbacks.get(walletAddress)?.delete(onUpdate);
      }
      
      if (!transactionCallbacks.get(walletAddress)?.size) {
        const subs = activeSubscriptions.get(subKey);
        if (subs) {
          alchemy.ws.off(subs.depositSub);
          alchemy.ws.off(subs.withdrawalSub);
          alchemy.ws.off(subs.fluxIncomingSub);
          alchemy.ws.off(subs.minedSub);
          activeSubscriptions.delete(subKey);
        }
        transactionCallbacks.delete(walletAddress);
      }
      
      if (activeSubscriptions.size === 0 && refundCheckInterval) {
        clearInterval(refundCheckInterval);
        refundCheckInterval = null;
      }
    };
  } catch (error) {
    console.error('Error subscribing to wallet transactions:', error);
    return () => {};
  }
}

async function monitorTransactionStatus(
  txHash: string, 
  walletAddress: string,
  txType: 'deposit' | 'withdrawal'
) {
  if (refundedTransactions.has(txHash)) {
    return;
  }
  
  try {
    let attempts = 0;
    const maxAttempts = 60;
    
    const checkStatus = async () => {
      attempts++;
      
      try {
        const receipt = await alchemy.core.getTransactionReceipt(txHash);
        
        if (receipt) {
          const pendingTx = pendingTransactions.get(txHash);
          if (pendingTx && !refundedTransactions.has(txHash)) {
            const token = getTokenSymbol(pendingTx.token === 'ETH' ? undefined : pendingTx.token === 'USDC' ? USDC_ADDRESS : FLUX_TOKEN_ADDRESS);
            const decimals = token === 'USDC' ? 6 : 18;
            const value = formatTokenAmount(pendingTx.value, decimals);
            const fee = txType === 'deposit' ? (parseFloat(value) * 0.01).toFixed(4) : '0';
            
            const txInfo: TransactionInfo = {
              hash: txHash,
              from: pendingTx.from,
              to: pendingTx.to,
              value,
              token,
              type: txType,
              status: receipt.status === 1 ? 'confirmed' : 'failed',
              fee,
              blockNumber: receipt.blockNumber,
              timestamp: new Date().toISOString(),
            };
            
            // Remove pending notification
            
            if (receipt.status === 1) {
              showTransactionToast(txInfo, walletAddress);
            } else {
              toast.custom((t) => (
                <IconNotification
                  title='Transaction Failed'
                  description={`${value} ${token} • ${txHash.slice(0, 10)}...${txHash.slice(-8)}`}
                  color='error'
                  confirmLabel='View on Basescan'
                  onClose={() => toast.dismiss(t)}
                  onConfirm={() => {
                    window.open(getBasescanUrl(txHash), '_blank');
                    toast.dismiss(t);
                  }}
                />
              ));
            }
            
            transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
            pendingTransactions.delete(txHash);
          }
          return true;
        }
        
        if (attempts < maxAttempts && !refundedTransactions.has(txHash)) {
          setTimeout(checkStatus, 5000);
        } else if (attempts >= maxAttempts) {
          const pendingTx = pendingTransactions.get(txHash);
          if (pendingTx && !refundedTransactions.has(txHash)) {
            // Remove pending notification
            toast.dismiss(txHash);
            toast.custom((t) => (
              <IconNotification
                title='Transaction Timeout'
                description={`Transaction confirmation timed out • ${txHash.slice(0, 10)}...${txHash.slice(-8)}`}
                color='error'
                confirmLabel='View on Basescan'
                onClose={() => toast.dismiss(t)}
                onConfirm={() => {
                  window.open(getBasescanUrl(txHash), '_blank');
                  toast.dismiss(t);
                }}
              />
            ));
            
            pendingTransactions.delete(txHash);
          }
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        if (attempts < maxAttempts && !refundedTransactions.has(txHash)) {
          setTimeout(checkStatus, 5000);
        }
      }
    };
    
    setTimeout(checkStatus, 3000);
  } catch (error) {
    console.error('Error monitoring transaction:', error);
  }
}

export function unsubscribeAll() {
  activeSubscriptions.forEach((subs) => {
    if (subs.depositSub) alchemy.ws.off(subs.depositSub);
    if (subs.withdrawalSub) alchemy.ws.off(subs.withdrawalSub);
    if (subs.fluxIncomingSub) alchemy.ws.off(subs.fluxIncomingSub);
    if (subs.minedSub) alchemy.ws.off(subs.minedSub);
  });
  
  activeSubscriptions.clear();
  transactionCallbacks.clear();
  pendingTransactions.clear();
  refundedTransactions.clear();
  
  if (refundCheckInterval) {
    clearInterval(refundCheckInterval);
    refundCheckInterval = null;
  }
}

export function getAlchemyInstance() {
  return alchemy;
}