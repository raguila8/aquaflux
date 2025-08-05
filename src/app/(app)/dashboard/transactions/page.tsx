'use client'

import { TransactionsTable } from '@/components/application/table/transactions-table'

export default function TransactionsPage() {
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <TransactionsTable showTabs={true} />
      </div>
    </div>
  )
}
