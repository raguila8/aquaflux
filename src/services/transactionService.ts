import { ethers } from 'ethers';
import { FLUX_TOKEN_ADDRESS, ALCHEMY_RPC_URL } from '@/config/alchemy';
import { transactionCache } from './transactionCache';

const VAULT_ADDRESS = '0x25f2F5C009700Afd6A7ce831B5f1006B20F101c1';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  token: 'FLUX' | 'USDC';
  timestamp: number;
  type: 'deposit' | 'withdrawal';
  status: 'completed';
  blockNumber: number;
}

const MAX_BLOCKS_PER_FETCH = 2000;

export async function fetchTransactions(walletAddress: string): Promise<Transaction[]> {
  if (!walletAddress) return [];
  
  await transactionCache.setCurrentWallet(walletAddress);
  
  try {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
    const currentBlock = await provider.getBlockNumber();
    const lastCheckedBlock = transactionCache.getLastCheckedBlock();
    
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
      return transactionCache.getTransactions();
    }
    
    transactionCache.setLastCheckedBlock(toBlock);
    
    const fluxContract = new ethers.Contract(FLUX_TOKEN_ADDRESS, ERC20_ABI, provider);
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    
    const fluxDecimals = await fluxContract.decimals();
    const usdcDecimals = await usdcContract.decimals();
    
    const filterFluxIn = fluxContract.filters.Transfer(VAULT_ADDRESS, walletAddress);
    const filterFluxOut = fluxContract.filters.Transfer(walletAddress, VAULT_ADDRESS);
    const filterUsdcIn = usdcContract.filters.Transfer(VAULT_ADDRESS, walletAddress);
    const filterUsdcOut = usdcContract.filters.Transfer(walletAddress, VAULT_ADDRESS);
    
    const results = await Promise.allSettled([
      fluxContract.queryFilter(filterFluxIn, fromBlock, toBlock),
      fluxContract.queryFilter(filterFluxOut, fromBlock, toBlock),
      usdcContract.queryFilter(filterUsdcIn, fromBlock, toBlock),
      usdcContract.queryFilter(filterUsdcOut, fromBlock, toBlock),
    ]);
    
    const [fluxInResult, fluxOutResult, usdcInResult, usdcOutResult] = results;
    const fluxInEvents = fluxInResult.status === 'fulfilled' ? fluxInResult.value : [];
    const fluxOutEvents = fluxOutResult.status === 'fulfilled' ? fluxOutResult.value : [];
    const usdcInEvents = usdcInResult.status === 'fulfilled' ? usdcInResult.value : [];
    const usdcOutEvents = usdcOutResult.status === 'fulfilled' ? usdcOutResult.value : [];
    
    const transactions: Transaction[] = [];
    const allEvents = [
      ...fluxInEvents.map(e => ({ ...e, token: 'FLUX', decimals: fluxDecimals, type: 'withdrawal', from: VAULT_ADDRESS, to: walletAddress })),
      ...fluxOutEvents.map(e => ({ ...e, token: 'FLUX', decimals: fluxDecimals, type: 'deposit', from: walletAddress, to: VAULT_ADDRESS })),
      ...usdcInEvents.map(e => ({ ...e, token: 'USDC', decimals: usdcDecimals, type: 'withdrawal', from: VAULT_ADDRESS, to: walletAddress })),
      ...usdcOutEvents.map(e => ({ ...e, token: 'USDC', decimals: usdcDecimals, type: 'deposit', from: walletAddress, to: VAULT_ADDRESS })),
    ];
    
    const uniqueBlockNumbers = [...new Set(allEvents.map(e => e.blockNumber))];
    const blockPromises = uniqueBlockNumbers.map(blockNum => provider.getBlock(blockNum));
    const blocks = await Promise.all(blockPromises);
    const blockMap = new Map(blocks.map(b => [b?.number, b]));
    
    for (const event of allEvents) {
      const block = blockMap.get(event.blockNumber);
      if (block) {
        transactions.push({
          id: `${event.transactionHash}-${event.index}`,
          hash: event.transactionHash,
          from: event.from,
          to: event.to,
          value: ethers.formatUnits(event.args?.value || 0, event.decimals),
          token: event.token as 'FLUX' | 'USDC',
          timestamp: block.timestamp * 1000,
          type: event.type as 'deposit' | 'withdrawal',
          status: 'completed',
          blockNumber: event.blockNumber,
        });
      }
    }
    
    transactionCache.addTransactions(transactions);
    
    await transactionCache.saveToStorage();
    
    return transactionCache.getTransactions();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return transactionCache.getTransactions();
  }
}

export async function fetchAllMissingBlocks(walletAddress: string): Promise<void> {
  if (!walletAddress) return;
  
  await transactionCache.setCurrentWallet(walletAddress);
  
  const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
  const currentBlock = await provider.getBlockNumber();
  let lastCheckedBlock = transactionCache.getLastCheckedBlock();
  
  while (lastCheckedBlock && currentBlock - lastCheckedBlock > MAX_BLOCKS_PER_FETCH) {
    await fetchTransactions(walletAddress);
    lastCheckedBlock = transactionCache.getLastCheckedBlock();
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export function getNewTransactions(transactions: Transaction[]): Transaction[] {
  return transactionCache.getNewTransactions(transactions);
}