'use client'

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

const DashboardWrapper = dynamic(
  () => import('@/components/application/dashboard/DashboardWrapper').then(mod => ({ default: mod.DashboardWrapper })),
  { ssr: false }
)

import { MetricsSimple } from '@/components/application/metrics/metrics'
import { MetricSkeleton, ChartSkeleton, TableSkeleton } from '@/components/shared/SkeletonLoader'
import { useWallet } from '@/contexts/WalletContext'
import { useEffect, useState, useMemo } from 'react'
import { getWalletTransactions } from '@/services/vaultTransactionServiceVercel'
import { calculateFluxPrice, type FluxPriceData } from '@/services/fluxPriceService'
import { VAULT_ADDRESS } from '@/config/constants'

const REFRESH_INTERVAL = 5 * 60 * 1000;

function DashboardContent() {
  const { fluxBalance, address } = useWallet();
  const [fluxChange, setFluxChange] = useState({ percentage: '0', trend: 'neutral' as 'positive' | 'negative' | 'neutral' });
  const [priceData, setPriceData] = useState<FluxPriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await calculateFluxPrice(VAULT_ADDRESS);
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching FLUX price:', error);
      } finally {
        setPriceLoading(false);
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const portfolioValue = useMemo(() => {
    const tokenPrice = priceData?.price || 0.37;
    const value = parseFloat(fluxBalance || '0') * tokenPrice;
    return value.toFixed(2);
  }, [fluxBalance, priceData]);
  
  useEffect(() => {
    const calculateDailyChange = async () => {
      if (!address) return;
      
      try {
        setTransactionsLoading(true);
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
      } finally {
        setTransactionsLoading(false);
      }
    };
    
    calculateDailyChange();
    const interval = setInterval(calculateDailyChange, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [address, fluxBalance]);
  
  useEffect(() => {
    if (fluxBalance !== undefined) {
      setBalanceLoading(false);
    }
  }, [fluxBalance]);
  
  useEffect(() => {
    if (!chartLoading) return;
    const timer = setTimeout(() => setChartLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [chartLoading]);
  
  const trend = fluxChange.trend === 'neutral' ? 'positive' : fluxChange.trend;
  const priceTrend = (priceData?.priceChangePercentage24h || 0) >= 0 ? 'positive' : 'negative';
  const priceChangeDisplay = Math.abs(priceData?.priceChangePercentage24h || 0).toFixed(2);
  
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <div className='flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5'>
          {balanceLoading || transactionsLoading ? (
            <MetricSkeleton />
          ) : (
            <MetricsSimple
              title={fluxBalance || '0'}
              subtitle='Flux tokens'
              type='modern'
              trend={trend}
              change={`${fluxChange.percentage}%`}
              className='flex-1 lg:min-w-[320px]'
              actions={false}
            />
          )}
          
          {priceLoading ? (
            <MetricSkeleton />
          ) : (
            <MetricsSimple
              title={`$${priceData?.price?.toFixed(4) || '0.3700'}`}
              subtitle='Current token price'
              type='modern'
              trend={priceTrend}
              change={`${priceChangeDisplay}%`}
              className='flex-1 lg:min-w-[320px]'
              actions={false}
            />
          )}
          
          {balanceLoading || priceLoading ? (
            <MetricSkeleton />
          ) : (
            <MetricsSimple
              title={`$${portfolioValue}`}
              subtitle='Total portfolio value'
              type='modern'
              trend={trend}
              change={`${fluxChange.percentage}%`}
              className='flex-1 lg:min-w-[320px]'
              actions={false}
            />
          )}
        </div>

        {chartLoading ? <ChartSkeleton /> : <FluxChart />}
        
        {transactionsLoading ? <TableSkeleton /> : <TransactionsTable title='Recent transactions' />}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <DashboardContent />
    </DashboardWrapper>
  )
}