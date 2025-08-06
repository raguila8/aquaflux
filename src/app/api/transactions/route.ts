import { NextRequest, NextResponse } from 'next/server';
import { TransactionStorage } from '@/services/transactionStorage';
import { Transaction } from '@/services/transactionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const data = await TransactionStorage.loadWalletData(walletAddress);
    
    return NextResponse.json({
      transactions: data?.transactions || [],
      lastCheckedBlock: data?.lastCheckedBlock || null,
      lastFetchTime: data?.lastFetchTime || null
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, transactions, lastCheckedBlock } = body;
    
    if (!walletAddress || !transactions || !lastCheckedBlock) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const existingData = await TransactionStorage.loadWalletData(walletAddress);
    const existingTxs = existingData?.transactions || [];
    
    const mergedTransactions = await TransactionStorage.mergeTransactions(
      existingTxs,
      transactions as Transaction[]
    );

    await TransactionStorage.saveWalletData(
      walletAddress,
      mergedTransactions,
      lastCheckedBlock
    );
    
    return NextResponse.json({ 
      success: true,
      transactionCount: mergedTransactions.length 
    });
  } catch (error) {
    console.error('Error saving transactions:', error);
    return NextResponse.json({ error: 'Failed to save transactions' }, { status: 500 });
  }
}