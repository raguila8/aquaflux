'use client'

import dynamic from 'next/dynamic'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const FluxAnalytics = dynamic(
  () => import('@/components/application/FluxAnalytics').then(mod => ({ default: mod.FluxAnalytics })),
  { 
    loading: () => (
      <div className="space-y-6">
        <div className="h-48 animate-pulse bg-zinc-800/50 rounded-lg" />
        <div className="h-96 animate-pulse bg-zinc-800/50 rounded-lg" />
        <div className="h-64 animate-pulse bg-zinc-800/50 rounded-lg" />
      </div>
    ),
    ssr: false 
  }
)

export default function Analytics() {
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
      <div className='flex min-w-0 flex-1 flex-col'>
        <FluxAnalytics />
      </div>
    </div>
  )
}
