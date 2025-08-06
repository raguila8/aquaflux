import { Transaction } from './transactionService';

export interface StoredWalletData {
  transactions: Transaction[];
  lastCheckedBlock: number | null;
  lastFetchTime: number | null;
}

export class TransactionAPI {
  static async loadWalletData(walletAddress: string): Promise<StoredWalletData> {
    try {
      const response = await fetch(`/api/transactions?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to load wallet data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading wallet data:', error);
      return {
        transactions: [],
        lastCheckedBlock: null,
        lastFetchTime: null
      };
    }
  }

  static async saveWalletData(
    walletAddress: string,
    transactions: Transaction[],
    lastCheckedBlock: number
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          transactions,
          lastCheckedBlock
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save wallet data');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving wallet data:', error);
      return false;
    }
  }
}