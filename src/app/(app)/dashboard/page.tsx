'use client'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { FluxChart } from '@/components/application/charts/flux-chart'
import { MetricsSimple } from '@/components/application/metrics/metrics'

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <div className='flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5'>
          <MetricsSimple
            title='4350.67'
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
            title='+147%'
            subtitle='Total portfolio performance'
            type='modern'
            trend='negative'
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
