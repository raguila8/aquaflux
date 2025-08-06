'use client'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TransactionsPage() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();
  
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
        <TransactionsTable showTabs={true} />
      </div>
    </div>
  )
}
