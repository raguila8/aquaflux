'use client'

export const dynamic = 'force-dynamic'

import dynamic from 'next/dynamic'

const TransactionsTable = dynamic(
  () => import('@/components/application/table/transactions-table').then(mod => ({ default: mod.TransactionsTable })),
  { 
    loading: () => <div className="h-96 animate-pulse bg-zinc-800/50 rounded-lg" />,
    ssr: false 
  }
)

const FluxChart = dynamic(
  () => import('@/components/application/charts/flux-chart').then(mod => ({ default: mod.FluxChart })),
  { 
    loading: () => <div className="h-80 animate-pulse bg-zinc-800/50 rounded-lg" />,
    ssr: false 
  }
)
import { MetricsSimple } from '@/components/application/metrics/metrics'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { getWalletTransactions } from '@/services/vaultTransactionServiceVercel'

const TOKEN_PRICE = 0.37;
const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function Dashboard() {
  const { isConnected, fluxBalance, connect, address } = useWallet();
  const router = useRouter();
  const [fluxChange, setFluxChange] = useState({ percentage: '0', trend: 'neutral' as 'positive' | 'negative' | 'neutral' });
  
  const portfolioValue = useMemo(() => {
    const value = parseFloat(fluxBalance || '0') * TOKEN_PRICE;
    return value.toFixed(2);
  }, [fluxBalance]);
  
  useEffect(() => {
    const calculateDailyChange = async () => {
      if (!address) return;
      
      try {
        const transactions = await getWalletTransactions(address);
        const now = Date.now();
        const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
        
        const recentTxs = transactions.filter(tx => 
          tx.timestamp >= twentyFourHoursAgo && tx.token === 'FLUX'
        );
        
        let netChange = 0;
        recentTxs.forEach(tx => {
          const amount = parseFloat(tx.value);
          netChange += tx.type === 'incoming' ? amount : -amount;
        });
        
        const currentBalance = parseFloat(fluxBalance || '0');
        const previousBalance = currentBalance - netChange;
        
        if (previousBalance > 0) {
          const percentageChange = ((netChange / previousBalance) * 100).toFixed(1);
          setFluxChange({
            percentage: Math.abs(parseFloat(percentageChange)).toString(),
            trend: netChange > 0 ? 'positive' : netChange < 0 ? 'negative' : 'neutral'
          });
        } else if (netChange !== 0) {
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
    const interval = setInterval(calculateDailyChange, REFRESH_INTERVAL);
    
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
  
  const trend = fluxChange.trend === 'neutral' ? 'positive' : fluxChange.trend;
  
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <div className='flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5'>
          <MetricsSimple
            title={fluxBalance || '0'}
            subtitle='Flux tokens'
            type='modern'
            trend={trend}
            change={`${fluxChange.percentage}%`}
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
          <MetricsSimple
            title={`$${TOKEN_PRICE}`}
            subtitle='Current token price'
            type='modern'
            trend='positive'
            change='12%'
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
          <MetricsSimple
            title={`$${portfolioValue}`}
            subtitle='Total portfolio value'
            type='modern'
            trend={trend}
            change={`${fluxChange.percentage}%`}
            className='flex-1 lg:min-w-[320px]'
            actions={false}
          />
        </div>

        <FluxChart />
        <TransactionsTable title='Recent transactions' />
      </div>
    </div>
  )
}