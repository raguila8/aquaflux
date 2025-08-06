import { ethers } from 'ethers';
import { FLUX_TOKEN_ADDRESS, ALCHEMY_RPC_URL, VAULT_ADDRESS, USDC_ADDRESS } from '@/config/constants';
import { memoryCache } from './memoryTransactionCache';
const MAX_BLOCKS_PER_FETCH = 2000;

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

export async function fetchVaultTransactions(): Promise<VaultTransaction[]> {
  try {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
    const currentBlock = await provider.getBlockNumber();
    
    let fromBlock: number;
    let toBlock: number = currentBlock;
    
    if (!memoryCache.isInitialized() || memoryCache.shouldRefetch()) {
      fromBlock = Math.max(0, currentBlock - MAX_BLOCKS_PER_FETCH);
      memoryCache.setInitialized(true);
    } else {
      const lastCheckedBlock = memoryCache.getLastCheckedBlock();
      if (lastCheckedBlock >= currentBlock) {
        return memoryCache.getAllTransactions();
      }
      fromBlock = lastCheckedBlock + 1;
    }
    
    const fluxContract = new ethers.Contract(FLUX_TOKEN_ADDRESS, ERC20_ABI, provider);
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    
    const [fluxDecimals, usdcDecimals] = await Promise.all([
      fluxContract.decimals(),
      usdcContract.decimals()
    ]);
    
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
        if ('args' in event && event.args?.to && event.args.to !== VAULT_ADDRESS) {
          allEvents.push({
            ...event,
            token: 'FLUX',
            decimals: fluxDecimals,
            type: 'outgoing',
            walletAddress: event.args.to
          });
        }
      }
    }
    
    if (fluxToResult.status === 'fulfilled') {
      for (const event of fluxToResult.value) {
        if ('args' in event && event.args?.from && event.args.from !== VAULT_ADDRESS) {
          allEvents.push({
            ...event,
            token: 'FLUX',
            decimals: fluxDecimals,
            type: 'incoming',
            walletAddress: event.args.from
          });
        }
      }
    }
    
    if (usdcFromResult.status === 'fulfilled') {
      for (const event of usdcFromResult.value) {
        if ('args' in event && event.args?.to && event.args.to !== VAULT_ADDRESS) {
          allEvents.push({
            ...event,
            token: 'USDC',
            decimals: usdcDecimals,
            type: 'outgoing',
            walletAddress: event.args.to
          });
        }
      }
    }
    
    if (usdcToResult.status === 'fulfilled') {
      for (const event of usdcToResult.value) {
        if ('args' in event && event.args?.from && event.args.from !== VAULT_ADDRESS) {
          allEvents.push({
            ...event,
            token: 'USDC',
            decimals: usdcDecimals,
            type: 'incoming',
            walletAddress: event.args.from
          });
        }
      }
    }
    
    if (allEvents.length === 0) {
      memoryCache.setLastCheckedBlock(toBlock);
      return memoryCache.getAllTransactions();
    }
    
    const uniqueBlockNumbers = [...new Set(allEvents.map(e => e.blockNumber))];
    const blockPromises = uniqueBlockNumbers.map(blockNum => provider.getBlock(blockNum));
    const blocks = await Promise.all(blockPromises);
    const blockMap = new Map(blocks.map(b => [b?.number, b]));
    
    const transactions: VaultTransaction[] = [];
    
    for (const event of allEvents) {
      const block = blockMap.get(event.blockNumber);
      if (block) {
        transactions.push({
          id: `${event.transactionHash}-${event.index}`,
          hash: event.transactionHash,
          from: event.type === 'incoming' ? event.walletAddress : VAULT_ADDRESS,
          to: event.type === 'incoming' ? VAULT_ADDRESS : event.walletAddress,
          value: ethers.formatUnits('args' in event ? event.args?.value || 0 : 0, event.decimals),
          token: event.token as 'FLUX' | 'USDC',
          timestamp: block.timestamp * 1000,
          type: event.type as 'incoming' | 'outgoing',
          walletAddress: event.walletAddress,
          blockNumber: event.blockNumber,
        });
      }
    }
    
    memoryCache.setLastCheckedBlock(toBlock);
    memoryCache.addTransactions(transactions);
    
    return memoryCache.getAllTransactions();
  } catch (error) {
    console.error('Error fetching vault transactions:', error);
    return memoryCache.getAllTransactions();
  }
}

export function getWalletTransactions(walletAddress: string): VaultTransaction[] {
  return memoryCache.getTransactionsForWallet(walletAddress);
}

export function getNewTransactionsForWallet(
  walletAddress: string,
  previousTxIds: Set<string>
): VaultTransaction[] {
  const walletTxs = getWalletTransactions(walletAddress);
  return walletTxs.filter(tx => !previousTxIds.has(tx.id));
}