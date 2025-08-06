import { VaultTransaction } from './vaultTransactionServiceVercel';

class MemoryTransactionCache {
  private static instance: MemoryTransactionCache;
  private transactions: Map<string, VaultTransaction> = new Map();
  private lastCheckedBlock: number = 0;
  private lastFetchTime: number = 0;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): MemoryTransactionCache {
    if (!MemoryTransactionCache.instance) {
      MemoryTransactionCache.instance = new MemoryTransactionCache();
    }
    return MemoryTransactionCache.instance;
  }

  getLastCheckedBlock(): number {
    return this.lastCheckedBlock;
  }

  setLastCheckedBlock(block: number) {
    this.lastCheckedBlock = block;
    this.lastFetchTime = Date.now();
  }

  addTransactions(txs: VaultTransaction[]) {
    for (const tx of txs) {
      this.transactions.set(tx.id, tx);
    }
  }

  getTransactionsForWallet(walletAddress: string): VaultTransaction[] {
    const allTxs = Array.from(this.transactions.values());
    return allTxs.filter(
      tx => tx.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  getAllTransactions(): VaultTransaction[] {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setInitialized(value: boolean) {
    this.initialized = value;
  }

  shouldRefetch(): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - this.lastFetchTime > fiveMinutes;
  }
}

export const memoryCache = MemoryTransactionCache.getInstance();