import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { toast } from 'sonner';
import { notify } from '@/lib/notify';
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
const sentTokenTypes = new Map<string, 'FLUX' | 'USDC' | null>(); // Track what token each wallet sent

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

function getSentTokenType(walletAddress: string): 'FLUX' | 'USDC' | null {
  return sentTokenTypes.get(walletAddress) || null;
}

function checkForRefund(userAddress: string, originalTx: PendingTransaction) {
  const checkTime = Date.now();
  const timeDiff = checkTime - originalTx.timestamp;
  
  if (timeDiff > 5000 && timeDiff < 60000) {
    // Look for incoming transaction of the SAME token (failed transaction)
    const refundTx = Array.from(pendingTransactions.values()).find(tx => {
      return tx.from === VAULT_ADDRESS &&
             tx.to === userAddress &&
             tx.token === originalTx.token && // Same token = failed
             Math.abs(tx.timestamp - originalTx.timestamp) < 10000 &&
             !tx.isRefund;
    });
    
    if (refundTx) {
      refundedTransactions.add(originalTx.hash);
      refundedTransactions.add(refundTx.hash);
      
      notify.error({
        title: 'Transaction Failed',
        description: `10 FLUX minimum required. ${formatTokenAmount(originalTx.value, originalTx.token === 'USDC' ? 6 : 18)} ${originalTx.token} returned to wallet • ${originalTx.hash.slice(0, 10)}...${originalTx.hash.slice(-8)}`,
        confirmLabel: 'View on Basescan',
        onConfirm: () => window.open(getBasescanUrl(originalTx.hash), '_blank'),
      });
      
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
    // Show pending notification with warning icon for outgoing transactions
    const toastId = notify.warning({
      title: `Sending ${tx.token}`,
      description: `${tx.value} ${tx.token} to vault${tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      confirmLabel: 'View on Basescan',
      onConfirm: () => window.open(basescanUrl, '_blank'),
    });
    // Store the toast ID for later dismissal
    (window as any)[`toast_${tx.hash}`] = toastId;
  } else if (tx.status === 'confirmed' && tx.type !== 'failed') {
    const isDeposit = tx.type === 'deposit';
    const successAction = isDeposit ? 'Sent' : 'Received';
    
    // Only dismiss pending toast if this is a deposit confirmation
    if (isDeposit && (window as any)[`toast_${tx.hash}`]) {
      toast.dismiss((window as any)[`toast_${tx.hash}`]);
      delete (window as any)[`toast_${tx.hash}`];
    }
    
    notify.success({
      title: `${successAction} ${tx.token}!`,
      description: `${tx.value} ${tx.token} successfully ${successAction.toLowerCase()}${tx.fee !== '0' ? ` (Fee: ${tx.fee} ${tx.token})` : ''} • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      confirmLabel: 'View on Basescan',
      onConfirm: () => window.open(basescanUrl, '_blank'),
    });
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
    notify.info({
      title: 'WebSocket Connected',
      description: `Monitoring ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} for USDC and FLUX transactions`,
    });
    
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
        
        // Track what token type was sent for later comparison (only USDC/FLUX, never ETH)
        if (token !== 'ETH') {
          sentTokenTypes.set(walletAddress, token);
        }
        
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
        
        // For incoming transactions from vault, show as success immediately
        const txInfo: TransactionInfo = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value,
          token,
          type: 'withdrawal',
          status: 'confirmed', // Show as confirmed/success immediately for receiving
          fee: '0',
          timestamp: new Date().toISOString(),
        };
        
        showTransactionToast(txInfo, walletAddress);
        transactionCallbacks.get(walletAddress)?.forEach(cb => cb(txInfo));
        
        // Still monitor for actual confirmation
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
          
          // For incoming FLUX, show as success immediately
          const txInfo: TransactionInfo = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value,
            token: 'FLUX',
            type: 'withdrawal',
            status: 'confirmed', // Show as success for receiving
            fee: '0',
            timestamp: new Date().toISOString(),
          };
          
          // Check if this is a successful swap (USDC sent, FLUX received)
          const sentTokenType = getSentTokenType(walletAddress);
          const isSuccessfulSwap = sentTokenType === 'USDC'; // Only USDC→FLUX is a successful swap
          
          // Show special notification for minted FLUX or successful swaps
          if (isMinted || isSuccessfulSwap) {
            const title = isMinted ? 'FLUX Minted!' : 'Swap Successful!';
            const description = isMinted 
              ? `Receiving ${value} newly minted FLUX tokens • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`
              : `Successfully received ${value} FLUX for your USDC • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`;
              
            notify.success({
              title,
              description,
              confirmLabel: 'View on Basescan',
              onConfirm: () => window.open(getBasescanUrl(tx.hash), '_blank'),
            });
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
              notify.error({
                title: 'Transaction Failed',
                description: `${value} ${token} • ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
                confirmLabel: 'View on Basescan',
                onConfirm: () => window.open(getBasescanUrl(txHash), '_blank'),
              });
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
            if ((window as any)[`toast_${txHash}`]) {
              toast.dismiss((window as any)[`toast_${txHash}`]);
              delete (window as any)[`toast_${txHash}`];
            }
            notify.error({
              title: 'Transaction Timeout',
              description: `Transaction confirmation timed out • ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => window.open(getBasescanUrl(txHash), '_blank'),
            });
            
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
  sentTokenTypes.clear();
  
  if (refundCheckInterval) {
    clearInterval(refundCheckInterval);
    refundCheckInterval = null;
  }
}

export function getAlchemyInstance() {
  return alchemy;
}