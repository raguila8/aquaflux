'use client'

import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface DashboardWrapperProps {
  children: ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { isConnected, isReady } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (isReady && !isConnected) {
      router.replace('/')
    }
  }, [isConnected, isReady, router])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-zinc-800/50 rounded-lg mb-4"></div>
          <div className="h-4 w-32 bg-zinc-800/50 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
          <p className="text-zinc-400">Please wait while we redirect you to the homepage.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}