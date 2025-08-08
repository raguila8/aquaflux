'use client'

export const dynamic = 'force-dynamic'

import dynamic from 'next/dynamic'
import { TransactionsTable } from '@/components/application/table/transactions-table'

const DashboardWrapper = dynamic(
  () => import('@/components/application/dashboard/DashboardWrapper').then(mod => ({ default: mod.DashboardWrapper })),
  { ssr: false }
)

function TransactionsContent() {
  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <TransactionsTable showTabs={true} />
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <DashboardWrapper>
      <TransactionsContent />
    </DashboardWrapper>
  )
}
