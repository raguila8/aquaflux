import { ALCHEMY_RPC_URL, VAULT_ADDRESS, FLUX_TOKEN_ADDRESS, USDC_ADDRESS } from '@/config/constants';

// Helper function to check if Alchemy is available
function checkAlchemyAvailable(): boolean {
  if (!ALCHEMY_RPC_URL) {
    console.warn('Alchemy API key not configured, blockchain data unavailable');
    return false;
  }
  return true;
}

interface AlchemyTransaction {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: any | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string | null;
    decimal: string | null;
  };
  metadata?: {
    blockTimestamp: string;
  };
}

interface AssetTransfersResponse {
  jsonrpc: string;
  id: number;
  result: {
    transfers: AlchemyTransaction[];
    pageKey?: string;
  };
}

interface TransactionReceipt {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  logs: any[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: string;
  type: string;
}

/**
 * Get asset transfers for the vault using Alchemy's Transfers API
 */
export async function getVaultAssetTransfers(
  fromBlock?: string,
  toBlock: string = 'latest',
  pageKey?: string
): Promise<AlchemyTransaction[]> {
  try {
    if (!checkAlchemyAvailable()) {
      return [];
    }

    const allTransfers: AlchemyTransaction[] = [];
    
    // Get transfers FROM the vault
    const fromVaultResponse = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: fromBlock || '0x0',
            toBlock: toBlock,
            fromAddress: VAULT_ADDRESS,
            contractAddresses: [FLUX_TOKEN_ADDRESS, USDC_ADDRESS],
            category: ['erc20'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: '0x3e8', // 1000 results
            pageKey: pageKey,
          },
        ],
        id: 1,
      }),
    });

    if (!fromVaultResponse.ok) {
      throw new Error(`HTTP error! status: ${fromVaultResponse.status}`);
    }

    const fromVaultData: AssetTransfersResponse = await fromVaultResponse.json();
    
    if (fromVaultData.result && fromVaultData.result.transfers) {
      allTransfers.push(...fromVaultData.result.transfers);
    }

    // Get transfers TO the vault
    const toVaultResponse = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: fromBlock || '0x0',
            toBlock: toBlock,
            toAddress: VAULT_ADDRESS,
            contractAddresses: [FLUX_TOKEN_ADDRESS, USDC_ADDRESS],
            category: ['erc20'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: '0x3e8', // 1000 results
            pageKey: pageKey,
          },
        ],
        id: 1,
      }),
    });

    if (!toVaultResponse.ok) {
      throw new Error(`HTTP error! status: ${toVaultResponse.status}`);
    }

    const toVaultData: AssetTransfersResponse = await toVaultResponse.json();
    
    if (toVaultData.result && toVaultData.result.transfers) {
      allTransfers.push(...toVaultData.result.transfers);
    }

    // Sort by block number (most recent first)
    allTransfers.sort((a, b) => {
      const blockA = parseInt(a.blockNum, 16);
      const blockB = parseInt(b.blockNum, 16);
      return blockB - blockA;
    });

    return allTransfers;
  } catch (error) {
    console.error('Error fetching vault asset transfers:', error);
    return [];
  }
}

/**
 * Get asset transfers for a specific wallet address
 */
export async function getWalletAssetTransfers(
  walletAddress: string,
  fromBlock?: string,
  toBlock: string = 'latest'
): Promise<AlchemyTransaction[]> {
  try {
    if (!checkAlchemyAvailable()) {
      return [];
    }

    const allTransfers: AlchemyTransaction[] = [];
    
    // Get transfers where wallet interacts with vault
    const response = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: fromBlock || '0x0',
            toBlock: toBlock,
            fromAddress: walletAddress,
            toAddress: VAULT_ADDRESS,
            contractAddresses: [FLUX_TOKEN_ADDRESS, USDC_ADDRESS],
            category: ['erc20'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: '0x3e8',
          },
        ],
        id: 1,
      }),
    });

    if (response.ok) {
      const data: AssetTransfersResponse = await response.json();
      if (data.result && data.result.transfers) {
        allTransfers.push(...data.result.transfers);
      }
    }

    // Get transfers from vault to wallet
    const reverseResponse = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: fromBlock || '0x0',
            toBlock: toBlock,
            fromAddress: VAULT_ADDRESS,
            toAddress: walletAddress,
            contractAddresses: [FLUX_TOKEN_ADDRESS, USDC_ADDRESS],
            category: ['erc20'],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: '0x3e8',
          },
        ],
        id: 1,
      }),
    });

    if (reverseResponse.ok) {
      const reverseData: AssetTransfersResponse = await reverseResponse.json();
      if (reverseData.result && reverseData.result.transfers) {
        allTransfers.push(...reverseData.result.transfers);
      }
    }

    // Sort by block number (most recent first)
    allTransfers.sort((a, b) => {
      const blockA = parseInt(a.blockNum, 16);
      const blockB = parseInt(b.blockNum, 16);
      return blockB - blockA;
    });

    return allTransfers;
  } catch (error) {
    console.error('Error fetching wallet asset transfers:', error);
    return [];
  }
}

/**
 * Get transaction receipt by hash
 */
export async function getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null> {
  try {
    if (!checkAlchemyAvailable()) {
      return null;
    }
    
    const response = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return null;
  }
}

/**
 * Format Alchemy transaction for display
 */
export function formatAlchemyTransaction(tx: AlchemyTransaction) {
  const isDeposit = tx.to.toLowerCase() === VAULT_ADDRESS.toLowerCase();
  const token = tx.asset === 'FLUX' || 
                tx.rawContract.address?.toLowerCase() === FLUX_TOKEN_ADDRESS.toLowerCase() 
                  ? 'FLUX' 
                  : 'USDC';
  
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    token,
    type: isDeposit ? 'deposit' : 'withdrawal',
    timestamp: tx.metadata?.blockTimestamp 
      ? new Date(tx.metadata.blockTimestamp).toISOString() 
      : new Date().toISOString(),
    blockNumber: parseInt(tx.blockNum, 16),
    category: tx.category,
    walletAddress: isDeposit ? tx.from : tx.to,
  };
}

/**
 * Subscribe to new pending transactions (WebSocket)
 */
export function subscribeToNewTransactions(
  callback: (tx: any) => void
): () => void {
  if (!checkAlchemyAvailable()) {
    return () => {}; // Return empty cleanup function
  }
  
  const ws = new WebSocket(ALCHEMY_RPC_URL!.replace('https://', 'wss://'));
  
  ws.onopen = () => {
    // Subscribe to new pending transactions
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_subscribe',
      params: ['alchemy_pendingTransactions', {
        toAddress: [VAULT_ADDRESS],
        fromAddress: [VAULT_ADDRESS],
      }],
      id: 1,
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'eth_subscription' && data.params) {
      callback(data.params.result);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
}

/**
 * Get the current block number
 */
export async function getCurrentBlockNumber(): Promise<number> {
  try {
    if (!checkAlchemyAvailable()) {
      return 0;
    }
    
    const response = await fetch(ALCHEMY_RPC_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseInt(data.result, 16);
  } catch (error) {
    console.error('Error fetching current block number:', error);
    return 0;
  }
}