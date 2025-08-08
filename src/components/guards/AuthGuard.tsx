'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/contexts/WalletContext'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, isReady, connect } = useWallet()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [hasTriggeredConnect, setHasTriggeredConnect] = useState(false)

  useEffect(() => {
    // Wait for wallet to be ready before checking auth
    if (!isReady) return

    // If not connected and haven't triggered connect yet
    if (!isConnected && !hasTriggeredConnect) {
      setHasTriggeredConnect(true)
      
      // Redirect to home and open wallet modal
      router.push('/')
      
      // Small delay to ensure navigation completes before opening modal
      setTimeout(() => {
        connect()
      }, 500)
      
      return
    }

    // If connected, allow access
    if (isConnected) {
      setIsChecking(false)
    }
  }, [isConnected, isReady, router, connect, hasTriggeredConnect])

  // Show loading state while checking auth
  if (isChecking || !isReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-aqua-500/20 border-t-aqua-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If not connected after check, don't render children
  if (!isConnected) {
    return null
  }

  // Render protected content
  return <>{children}</>
}