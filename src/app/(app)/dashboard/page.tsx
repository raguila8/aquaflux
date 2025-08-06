'use client'

export const dynamic = 'force-dynamic'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { FluxChart } from '@/components/application/charts/flux-chart'
import { MetricsSimple } from '@/components/application/metrics/metrics'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { isConnected, fluxBalance, connect } = useWallet();
  const router = useRouter();
  
  const tokenPrice = 0.37;
  const portfolioValue = parseFloat(fluxBalance || '0') * tokenPrice;
  const formattedPortfolioValue = portfolioValue.toFixed(2);
  
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
            trend='positive'
            change='10%'
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
            trend='positive'
            change='2%'
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
