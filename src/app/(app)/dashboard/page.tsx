'use client'

export const dynamic = 'force-dynamic'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { FluxChart } from '@/components/application/charts/flux-chart'
import { MetricsSimple } from '@/components/application/metrics/metrics'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getWalletTransactions } from '@/services/vaultTransactionServiceVercel'

export default function Dashboard() {
  const { isConnected, fluxBalance, connect, address } = useWallet();
  const router = useRouter();
  const [fluxChange, setFluxChange] = useState({ percentage: '0', trend: 'neutral' as 'positive' | 'negative' | 'neutral' });
  
  const tokenPrice = 0.37;
  const portfolioValue = parseFloat(fluxBalance || '0') * tokenPrice;
  const formattedPortfolioValue = portfolioValue.toFixed(2);
  
  // Calculate 24h change in flux tokens
  useEffect(() => {
    const calculateDailyChange = async () => {
      if (!address) return;
      
      try {
        const transactions = await getWalletTransactions(address);
        const now = Date.now();
        const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
        
        // Filter transactions from last 24 hours
        const recentTxs = transactions.filter(tx => 
          tx.timestamp >= twentyFourHoursAgo && tx.token === 'FLUX'
        );
        
        // Calculate net change
        let netChange = 0;
        recentTxs.forEach(tx => {
          const amount = parseFloat(tx.value);
          if (tx.type === 'incoming') {
            netChange += amount; // Received from vault
          } else {
            netChange -= amount; // Sent to vault
          }
        });
        
        // Calculate percentage change based on current balance
        const currentBalance = parseFloat(fluxBalance || '0');
        const previousBalance = currentBalance - netChange;
        
        if (previousBalance > 0) {
          const percentageChange = ((netChange / previousBalance) * 100).toFixed(1);
          setFluxChange({
            percentage: Math.abs(parseFloat(percentageChange)).toString(),
            trend: netChange > 0 ? 'positive' : netChange < 0 ? 'negative' : 'neutral'
          });
        } else if (netChange !== 0) {
          // If no previous balance but there's activity
          setFluxChange({
            percentage: '100',
            trend: netChange > 0 ? 'positive' : 'negative'
          });
        } else {
          setFluxChange({
            percentage: '0',
            trend: 'neutral'
          });
        }
      } catch (error) {
        console.error('Error calculating daily change:', error);
      }
    };
    
    calculateDailyChange();
    // Refresh every 5 minutes
    const interval = setInterval(calculateDailyChange, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [address, fluxBalance]);
  
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      setTimeout(() => {
        connect();
      }, 100);
    }
  }, [isConnected, router, connect]);
  
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <div className='flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5'>
          <MetricsSimple
            title={fluxBalance || '0'}
            subtitle='Flux tokens'
            type='modern'
            trend={fluxChange.trend === 'neutral' ? 'positive' : fluxChange.trend}
            change={`${fluxChange.percentage}%`}
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
          <MetricsSimple
            title='$0.37'
            subtitle='Current token price'
            type='modern'
            trend='positive'
            change='12%'
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
          <MetricsSimple
            title={`$${formattedPortfolioValue}`}
            subtitle='Total portfolio value'
            type='modern'
            trend={fluxChange.trend === 'neutral' ? 'positive' : fluxChange.trend}
            change={`${fluxChange.percentage}%`}
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
        </div>

        <FluxChart />

        {/* Recent transactions */}
        <TransactionsTable title='Recent transactions' />
      </div>
    </div>
  )
}