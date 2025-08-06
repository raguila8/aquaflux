import { ALCHEMY_API_KEY, VAULT_ADDRESS } from '@/config/constants';

export interface VaultTransaction {
  hash: string;
  type: 'deposit' | 'withdrawal';
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  tokenAddress?: string;
  blockNumber: string;
  timestamp: string;
  category: string;
}

interface AlchemyTransfer {
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
 * Fetches all transactions between a wallet address and the vault address
 * @param walletAddress The connected wallet address
 * @returns Array of transactions between wallet and vault
 */
export async function getWalletVaultTransactions(walletAddress: string): Promise<VaultTransaction[]> {
  if (!walletAddress) return [];

  const transactions: VaultTransaction[] = [];
  let pageKey: string | undefined;
  
  try {
    // Fetch transactions where wallet sent to vault (deposits)
    const depositsUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    do {
      const params: any = {
        fromAddress: walletAddress.toLowerCase(),
        toAddress: VAULT_ADDRESS.toLowerCase(),
        category: ['external', 'erc20', 'internal'],
        withMetadata: true,
        order: 'desc'
      };
      
      if (pageKey) {
        params.pageKey = pageKey;
      }
      
      const response = await fetch(depositsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [params]
        })
      });
      
      const data = await response.json();
      const result: AlchemyResponse = data.result;
      
      if (result?.transfers) {
        result.transfers.forEach(transfer => {
          transactions.push(formatTransaction(transfer, 'deposit'));
        });
      }
      
      pageKey = result?.pageKey;
    } while (pageKey);
    
    // Reset pageKey for withdrawals
    pageKey = undefined;
    
    // Fetch transactions where vault sent to wallet (withdrawals)
    do {
      const params: any = {
        fromAddress: VAULT_ADDRESS.toLowerCase(),
        toAddress: walletAddress.toLowerCase(),
        category: ['external', 'erc20', 'internal'],
        withMetadata: true,
        order: 'desc'
      };
      
      if (pageKey) {
        params.pageKey = pageKey;
      }
      
      const response = await fetch(depositsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [params]
        })
      });
      
      const data = await response.json();
      const result: AlchemyResponse = data.result;
      
      if (result?.transfers) {
        result.transfers.forEach(transfer => {
          transactions.push(formatTransaction(transfer, 'withdrawal'));
        });
      }
      
      pageKey = result?.pageKey;
    } while (pageKey);
    
    // Sort by block number (most recent first)
    transactions.sort((a, b) => {
      const blockA = parseInt(a.blockNumber, 16);
      const blockB = parseInt(b.blockNumber, 16);
      return blockB - blockA;
    });
    
  } catch (error) {
    console.error('Error fetching vault transactions:', error);
  }
  
  return transactions;
}

function formatTransaction(transfer: AlchemyTransfer, type: 'deposit' | 'withdrawal'): VaultTransaction {
  let value = '0';
  let tokenAddress: string | undefined;
  
  if (transfer.rawContract?.value) {
    const decimal = parseInt(transfer.rawContract.decimal || '18');
    value = (parseInt(transfer.rawContract.value, 16) / Math.pow(10, decimal)).toString();
    tokenAddress = transfer.rawContract.address;
  } else if (transfer.value !== null) {
    value = transfer.value.toString();
  }
  
  return {
    hash: transfer.hash,
    type,
    from: transfer.from,
    to: transfer.to,
    value,
    tokenSymbol: transfer.asset || 'ETH',
    tokenAddress,
    blockNumber: transfer.blockNum,
    timestamp: transfer.metadata?.blockTimestamp || new Date().toISOString(),
    category: transfer.category
  };
}

/**
 * Fetches all transactions for the vault address (all deposits and withdrawals)
 * @returns Array of all vault transactions
 */
export async function getAllVaultTransactions(): Promise<VaultTransaction[]> {
  const transactions: VaultTransaction[] = [];
  let pageKey: string | undefined;
  
  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    
    // Fetch all transactions TO the vault (deposits)
    do {
      const params: any = {
        toAddress: VAULT_ADDRESS.toLowerCase(),
        category: ['external', 'erc20', 'internal'],
        withMetadata: true,
        order: 'desc'
      };
      
      if (pageKey) {
        params.pageKey = pageKey;
      }
      
      const response = await fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [params]
        })
      });
      
      const data = await response.json();
      const result: AlchemyResponse = data.result;
      
      if (result?.transfers) {
        result.transfers.forEach(transfer => {
          transactions.push(formatTransaction(transfer, 'deposit'));
        });
      }
      
      pageKey = result?.pageKey;
    } while (pageKey);
    
    // Reset pageKey for withdrawals
    pageKey = undefined;
    
    // Fetch all transactions FROM the vault (withdrawals)
    do {
      const params: any = {
        fromAddress: VAULT_ADDRESS.toLowerCase(),
        category: ['external', 'erc20', 'internal'],
        withMetadata: true,
        order: 'desc'
      };
      
      if (pageKey) {
        params.pageKey = pageKey;
      }
      
      const response = await fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [params]
        })
      });
      
      const data = await response.json();
      const result: AlchemyResponse = data.result;
      
      if (result?.transfers) {
        result.transfers.forEach(transfer => {
          transactions.push(formatTransaction(transfer, 'withdrawal'));
        });
      }
      
      pageKey = result?.pageKey;
    } while (pageKey);
    
    // Sort by block number (most recent first)
    transactions.sort((a, b) => {
      const blockA = parseInt(a.blockNumber, 16);
      const blockB = parseInt(b.blockNumber, 16);
      return blockB - blockA;
    });
    
  } catch (error) {
    console.error('Error fetching all vault transactions:', error);
  }
  
  return transactions;
}