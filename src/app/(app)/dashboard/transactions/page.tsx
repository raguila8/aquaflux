'use client'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { CreditCardUp, Cryptocurrency03 } from '@untitledui-pro/icons/solid'
import { FluxChart } from '@/components/application/charts/flux-chart'
import { MetricsSimple } from '@/components/application/metrics/metrics'
import { Button } from '@/components/base/buttons/button'

export default function TransactionsPage() {
  return (
    <>
      <div className='flex flex-col gap-5'>
        {/* Page header */}
        <div className='flex flex-col justify-between gap-4 lg:flex-row'>
          <div className='flex flex-col gap-0.5 lg:gap-1'>
            <p className='text-primary lg:text-display-xs text-xl font-semibold'>
              Aquaflux Transactions
            </p>
            <p className='text-md text-tertiary'>
              Lorem ipsum dolor sit amet vestibulum augue.
            </p>
          </div>
          <div className='flex gap-3'>
            <Button size='md' color='secondary' iconLeading={CreditCardUp}>
              Withdraw
            </Button>
            <Button size='md' iconLeading={Cryptocurrency03}>
              Deposit
            </Button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-10 lg:flex-row'>
        <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
          <TransactionsTable showTabs={true} />
        </div>
      </div>
    </>
  )
}
