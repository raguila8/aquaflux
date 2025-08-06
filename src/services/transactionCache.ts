import { Transaction } from './transactionService';
import { TransactionAPI } from './transactionApi';

class TransactionCache {
  private transactions: Map<string, Transaction> = new Map();
  private lastCheckedBlock: number | null = null;
  private lastFetchTime: number = 0;
  private currentWallet: string | null = null;
  private isInitialized: boolean = false;
  
  async initialize(walletAddress: string) {
    if (this.currentWallet !== walletAddress || !this.isInitialized) {
      const storedData = await TransactionAPI.loadWalletData(walletAddress);
      this.transactions.clear();
      
      for (const tx of storedData.transactions) {
        this.transactions.set(tx.id, tx);
      }
      
      this.lastCheckedBlock = storedData.lastCheckedBlock;
      this.lastFetchTime = storedData.lastFetchTime || 0;
      this.currentWallet = walletAddress;
      this.isInitialized = true;
    }
  }
  
  addTransactions(txs: Transaction[]) {
    for (const tx of txs) {
      this.transactions.set(tx.id, tx);
    }
    this.lastFetchTime = Date.now();
  }
  
  async saveToStorage() {
    if (this.currentWallet && this.lastCheckedBlock) {
      await TransactionAPI.saveWalletData(
        this.currentWallet,
        this.getTransactions(),
        this.lastCheckedBlock
      );
    }
  }
  
  getTransactions(): Transaction[] {
    return Array.from(this.transactions.values()).sort((a, b) => b.timestamp - a.timestamp);
  }
  
  getNewTransactions(txs: Transaction[]): Transaction[] {
    const newTxs: Transaction[] = [];
    for (const tx of txs) {
      if (!this.transactions.has(tx.id)) {
        newTxs.push(tx);
      }
    }
    return newTxs;
  }
  
  getLastCheckedBlock(): number | null {
    return this.lastCheckedBlock;
  }
  
  setLastCheckedBlock(block: number) {
    this.lastCheckedBlock = block;
  }
  
  shouldForceFullFetch(): boolean {
    return false;
  }
  
  clear() {
    this.transactions.clear();
    this.lastCheckedBlock = null;
    this.lastFetchTime = 0;
    this.currentWallet = null;
    this.isInitialized = false;
  }
  
  async setCurrentWallet(wallet: string) {
    if (this.currentWallet && this.currentWallet !== wallet) {
      await this.saveToStorage();
      this.clear();
    }
    await this.initialize(wallet);
  }
  
  needsIncrementalFetch(): boolean {
    if (!this.lastCheckedBlock) return true;
    const hourAgo = Date.now() - (60 * 60 * 1000);
    return this.lastFetchTime < hourAgo;
  }
}

export const transactionCache = new TransactionCache();