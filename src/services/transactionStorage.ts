import { Transaction } from './transactionService';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'transactions', 'data');

interface WalletData {
  walletAddress: string;
  lastCheckedBlock: number;
  lastFetchTime: number;
  transactions: Transaction[];
}

export class TransactionStorage {
  private static async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  private static getFilePath(walletAddress: string): string {
    const fileName = `${walletAddress.toLowerCase()}.json`;
    return path.join(DATA_DIR, fileName);
  }

  static async loadWalletData(walletAddress: string): Promise<WalletData | null> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(walletAddress);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null;
      }
      console.error('Error loading wallet data:', error);
      return null;
    }
  }

  static async saveWalletData(
    walletAddress: string,
    transactions: Transaction[],
    lastCheckedBlock: number
  ): Promise<void> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(walletAddress);
      
      const walletData: WalletData = {
        walletAddress: walletAddress.toLowerCase(),
        lastCheckedBlock,
        lastFetchTime: Date.now(),
        transactions: transactions.sort((a, b) => b.timestamp - a.timestamp)
      };

      await fs.writeFile(filePath, JSON.stringify(walletData, null, 2));
    } catch (error) {
      console.error('Error saving wallet data:', error);
    }
  }

  static async mergeTransactions(
    existing: Transaction[],
    newTxs: Transaction[]
  ): Promise<Transaction[]> {
    const txMap = new Map<string, Transaction>();
    
    for (const tx of existing) {
      txMap.set(tx.id, tx);
    }
    
    for (const tx of newTxs) {
      txMap.set(tx.id, tx);
    }
    
    return Array.from(txMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  static async getLastCheckedBlock(walletAddress: string): Promise<number | null> {
    const data = await this.loadWalletData(walletAddress);
    return data?.lastCheckedBlock || null;
  }

  static async getAllWalletTransactions(walletAddress: string): Promise<Transaction[]> {
    const data = await this.loadWalletData(walletAddress);
    return data?.transactions || [];
  }
}