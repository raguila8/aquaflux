import { ethers } from 'ethers';
import { FLUX_TOKEN_ADDRESS, ALCHEMY_RPC_URL } from '@/config/alchemy';

const VAULT_ADDRESS = '0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const MAX_BLOCKS_PER_FETCH = 5000;

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

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

interface VaultData {
  lastCheckedBlock: number;
  lastFetchTime: number;
  transactions: VaultTransaction[];
}

class VaultTransactionCache {
  private vaultData: VaultData | null = null;
  private isInitialized: boolean = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const response = await fetch('/api/vault-transactions');
      if (response.ok) {
        this.vaultData = await response.json();
      } else {
        this.vaultData = {
          lastCheckedBlock: 0,
          lastFetchTime: 0,
          transactions: []
        };
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading vault data:', error);
      this.vaultData = {
        lastCheckedBlock: 0,
        lastFetchTime: 0,
        transactions: []
      };
      this.isInitialized = true;
    }
  }

  async saveVaultData() {
    if (!this.vaultData) return;
    
    try {
      await fetch('/api/vault-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.vaultData)
      });
    } catch (error) {
      console.error('Error saving vault data:', error);
    }
  }

  getLastCheckedBlock(): number {
    return this.vaultData?.lastCheckedBlock || 0;
  }

  setLastCheckedBlock(block: number) {
    if (this.vaultData) {
      this.vaultData.lastCheckedBlock = block;
      this.vaultData.lastFetchTime = Date.now();
    }
  }

  addTransactions(txs: VaultTransaction[]) {
    if (!this.vaultData) return;
    
    const txMap = new Map<string, VaultTransaction>();
    
    for (const tx of this.vaultData.transactions) {
      txMap.set(tx.id, tx);
    }
    
    for (const tx of txs) {
      txMap.set(tx.id, tx);
    }
    
    this.vaultData.transactions = Array.from(txMap.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getTransactionsForWallet(walletAddress: string): VaultTransaction[] {
    if (!this.vaultData) return [];
    
    return this.vaultData.transactions.filter(
      tx => tx.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  getAllTransactions(): VaultTransaction[] {
    return this.vaultData?.transactions || [];
  }
}

export const vaultCache = new VaultTransactionCache();

export async function fetchVaultTransactions(): Promise<VaultTransaction[]> {
  await vaultCache.initialize();
  
  try {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
    const currentBlock = await provider.getBlockNumber();
    const lastCheckedBlock = vaultCache.getLastCheckedBlock();
    
    let fromBlock: number;
    let toBlock: number = currentBlock;
    
    if (!lastCheckedBlock) {
      fromBlock = Math.max(0, currentBlock - MAX_BLOCKS_PER_FETCH);
    } else if (currentBlock - lastCheckedBlock > MAX_BLOCKS_PER_FETCH) {
      fromBlock = lastCheckedBlock + 1;
      toBlock = Math.min(currentBlock, lastCheckedBlock + MAX_BLOCKS_PER_FETCH);
    } else {
      fromBlock = lastCheckedBlock + 1;
    }
    
    if (fromBlock > currentBlock) {
      return vaultCache.getAllTransactions();
    }
    
    const fluxContract = new ethers.Contract(FLUX_TOKEN_ADDRESS, ERC20_ABI, provider);
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    
    const fluxDecimals = await fluxContract.decimals();
    const usdcDecimals = await usdcContract.decimals();
    
    const filterFluxFrom = fluxContract.filters.Transfer(VAULT_ADDRESS, null);
    const filterFluxTo = fluxContract.filters.Transfer(null, VAULT_ADDRESS);
    const filterUsdcFrom = usdcContract.filters.Transfer(VAULT_ADDRESS, null);
    const filterUsdcTo = usdcContract.filters.Transfer(null, VAULT_ADDRESS);
    
    const results = await Promise.allSettled([
      fluxContract.queryFilter(filterFluxFrom, fromBlock, toBlock),
      fluxContract.queryFilter(filterFluxTo, fromBlock, toBlock),
      usdcContract.queryFilter(filterUsdcFrom, fromBlock, toBlock),
      usdcContract.queryFilter(filterUsdcTo, fromBlock, toBlock),
    ]);
    
    const allEvents = [];
    const [fluxFromResult, fluxToResult, usdcFromResult, usdcToResult] = results;
    
    if (fluxFromResult.status === 'fulfilled') {
      for (const event of fluxFromResult.value) {
        allEvents.push({
          ...event,
          token: 'FLUX',
          decimals: fluxDecimals,
          type: 'outgoing',
          walletAddress: event.args?.to || ''
        });
      }
    }
    
    if (fluxToResult.status === 'fulfilled') {
      for (const event of fluxToResult.value) {
        allEvents.push({
          ...event,
          token: 'FLUX',
          decimals: fluxDecimals,
          type: 'incoming',
          walletAddress: event.args?.from || ''
        });
      }
    }
    
    if (usdcFromResult.status === 'fulfilled') {
      for (const event of usdcFromResult.value) {
        allEvents.push({
          ...event,
          token: 'USDC',
          decimals: usdcDecimals,
          type: 'outgoing',
          walletAddress: event.args?.to || ''
        });
      }
    }
    
    if (usdcToResult.status === 'fulfilled') {
      for (const event of usdcToResult.value) {
        allEvents.push({
          ...event,
          token: 'USDC',
          decimals: usdcDecimals,
          type: 'incoming',
          walletAddress: event.args?.from || ''
        });
      }
    }
    
    const uniqueBlockNumbers = [...new Set(allEvents.map(e => e.blockNumber))];
    const blockPromises = uniqueBlockNumbers.map(blockNum => provider.getBlock(blockNum));
    const blocks = await Promise.all(blockPromises);
    const blockMap = new Map(blocks.map(b => [b?.number, b]));
    
    const transactions: VaultTransaction[] = [];
    
    for (const event of allEvents) {
      const block = blockMap.get(event.blockNumber);
      if (block && event.walletAddress && event.walletAddress !== VAULT_ADDRESS) {
        transactions.push({
          id: `${event.transactionHash}-${event.index}`,
          hash: event.transactionHash,
          from: event.type === 'incoming' ? event.walletAddress : VAULT_ADDRESS,
          to: event.type === 'incoming' ? VAULT_ADDRESS : event.walletAddress,
          value: ethers.formatUnits(event.args?.value || 0, event.decimals),
          token: event.token as 'FLUX' | 'USDC',
          timestamp: block.timestamp * 1000,
          type: event.type as 'incoming' | 'outgoing',
          walletAddress: event.walletAddress,
          blockNumber: event.blockNumber,
        });
      }
    }
    
    vaultCache.setLastCheckedBlock(toBlock);
    vaultCache.addTransactions(transactions);
    await vaultCache.saveVaultData();
    
    return vaultCache.getAllTransactions();
  } catch (error) {
    console.error('Error fetching vault transactions:', error);
    return vaultCache.getAllTransactions();
  }
}

export function getWalletTransactions(walletAddress: string): VaultTransaction[] {
  return vaultCache.getTransactionsForWallet(walletAddress);
}

export function getNewTransactionsForWallet(
  walletAddress: string,
  previousTxIds: Set<string>
): VaultTransaction[] {
  const walletTxs = getWalletTransactions(walletAddress);
  return walletTxs.filter(tx => !previousTxIds.has(tx.id));
}