import { NextRequest, NextResponse } from 'next/server';
import { getWalletVaultTransactions, getAllVaultTransactions } from '@/services/vaultTransactionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    let transactions;
    
    if (walletAddress) {
      // Get transactions between the wallet and vault
      transactions = await getWalletVaultTransactions(walletAddress);
    } else {
      // Get all vault transactions
      transactions = await getAllVaultTransactions();
    }
    
    return NextResponse.json({
      transactions,
      lastFetchTime: Date.now()
    });
  } catch (error) {
    console.error('Error fetching vault transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vault transactions' }, 
      { status: 500 }
    );
  }
}