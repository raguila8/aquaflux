import { ALCHEMY_API_KEY, VAULT_ADDRESS, FLUX_TOKEN_ADDRESS, USDC_ADDRESS } from '@/config/constants';

export interface VaultTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  token: 'FLUX' | 'USDC';
  timestamp: number;
  type: 'incoming' | 'outgoing';
  walletAddress: string;
  blockNumber: number;
}

interface AlchemyTransfer {
  uniqueId: string;
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  asset: string;
  category: string;
  rawContract: {
    value?: string;
    address?: string;
    decimal?: string;
  };
  metadata?: {
    blockTimestamp?: string;
  };
}

interface AlchemyResponse {
  transfers: AlchemyTransfer[];
  pageKey?: string;
}

/**
 * Fetches all transactions for the vault (all deposits and withdrawals)
 */
export async function fetchVaultTransactions(): Promise<VaultTransaction[]> {
  const transactions: VaultTransaction[] = [];
  
  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    // Fetch incoming transactions (deposits to vault)
    const depositsResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          toAddress: VAULT_ADDRESS.toLowerCase(),
          category: ['external', 'erc20'],
          withMetadata: true,
          order: 'desc',
          maxCount: '0x3e8' // 1000 transactions
        }]
      })
    });
    
    const depositsData = await depositsResponse.json();
    const deposits: AlchemyResponse = depositsData.result;
    
    // Fetch outgoing transactions (withdrawals from vault)
    const withdrawalsResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromAddress: VAULT_ADDRESS.toLowerCase(),
          category: ['external', 'erc20'],
          withMetadata: true,
          order: 'desc',
          maxCount: '0x3e8' // 1000 transactions
        }]
      })
    });
    
    const withdrawalsData = await withdrawalsResponse.json();
    const withdrawals: AlchemyResponse = withdrawalsData.result;
    
    // Process deposits
    if (deposits?.transfers) {
      deposits.transfers.forEach(transfer => {
        const tx = formatTransferToTransaction(transfer, 'incoming');
        if (tx) transactions.push(tx);
      });
    }
    
    // Process withdrawals
    if (withdrawals?.transfers) {
      withdrawals.transfers.forEach(transfer => {
        const tx = formatTransferToTransaction(transfer, 'outgoing');
        if (tx) transactions.push(tx);
      });
    }
    
    // Sort by timestamp (most recent first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    
  } catch (error) {
    console.error('Error fetching vault transactions:', error);
  }
  
  return transactions;
}

/**
 * Get transactions for a specific wallet address
 */
export async function getWalletTransactions(walletAddress: string): Promise<VaultTransaction[]> {
  if (!walletAddress) return [];
  
  const transactions: VaultTransaction[] = [];
  
  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    // Fetch wallet's deposits to vault
    const depositsResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromAddress: walletAddress.toLowerCase(),
          toAddress: VAULT_ADDRESS.toLowerCase(),
          category: ['external', 'erc20'],
          withMetadata: true,
          order: 'desc'
        }]
      })
    });
    
    const depositsData = await depositsResponse.json();
    const deposits: AlchemyResponse = depositsData.result;
    
    // Fetch wallet's withdrawals from vault
    const withdrawalsResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromAddress: VAULT_ADDRESS.toLowerCase(),
          toAddress: walletAddress.toLowerCase(),
          category: ['external', 'erc20'],
          withMetadata: true,
          order: 'desc'
        }]
      })
    });
    
    const withdrawalsData = await withdrawalsResponse.json();
    const withdrawals: AlchemyResponse = withdrawalsData.result;
    
    // Process deposits (wallet sending to vault)
    if (deposits?.transfers) {
      deposits.transfers.forEach(transfer => {
        const tx = formatTransferToTransaction(transfer, 'outgoing', walletAddress);
        if (tx) transactions.push(tx);
      });
    }
    
    // Process withdrawals (vault sending to wallet)
    if (withdrawals?.transfers) {
      withdrawals.transfers.forEach(transfer => {
        const tx = formatTransferToTransaction(transfer, 'incoming', walletAddress);
        if (tx) transactions.push(tx);
      });
    }
    
    // Sort by timestamp (most recent first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
  }
  
  return transactions;
}

/**
 * Get new transactions for a wallet since a given timestamp
 */
export async function getNewTransactionsForWallet(
  walletAddress: string,
  sinceTimestamp: number
): Promise<VaultTransaction[]> {
  const allTransactions = await getWalletTransactions(walletAddress);
  return allTransactions.filter(tx => tx.timestamp > sinceTimestamp);
}

function formatTransferToTransaction(
  transfer: AlchemyTransfer,
  type: 'incoming' | 'outgoing',
  walletAddress?: string
): VaultTransaction | null {
  // Determine token type
  let token: 'FLUX' | 'USDC';
  
  if (transfer.rawContract?.address) {
    const contractAddress = transfer.rawContract.address.toLowerCase();
    if (contractAddress === FLUX_TOKEN_ADDRESS.toLowerCase()) {
      token = 'FLUX';
    } else if (contractAddress === USDC_ADDRESS.toLowerCase()) {
      token = 'USDC';
    } else {
      // Skip unknown tokens
      return null;
    }
  } else if (transfer.asset === 'FLUX' || transfer.asset === 'Flux Token') {
    token = 'FLUX';
  } else if (transfer.asset === 'USDC') {
    token = 'USDC';
  } else {
    // Skip non-FLUX/USDC transactions
    return null;
  }
  
  // Calculate value
  let value = '0';
  if (transfer.rawContract?.value) {
    const decimal = parseInt(transfer.rawContract.decimal || '18');
    value = (parseInt(transfer.rawContract.value, 16) / Math.pow(10, decimal)).toString();
  } else if (transfer.value !== null) {
    value = transfer.value.toString();
  }
  
  // Parse timestamp
  const timestamp = transfer.metadata?.blockTimestamp 
    ? new Date(transfer.metadata.blockTimestamp).getTime()
    : Date.now();
  
  // Determine wallet address
  const txWalletAddress = walletAddress || (
    type === 'incoming' ? transfer.from : transfer.to
  );
  
  return {
    id: transfer.uniqueId,
    hash: transfer.hash,
    from: transfer.from,
    to: transfer.to,
    value,
    token,
    timestamp,
    type,
    walletAddress: txWalletAddress,
    blockNumber: parseInt(transfer.blockNum, 16)
  };
}