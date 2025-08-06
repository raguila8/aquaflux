'use client'

import { ReactNode } from 'react'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, State } from 'wagmi'
import { wagmiAdapter, projectId, networks } from '@/config/reown'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const getAppUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'https://aquaflux.tech'
}

const metadata = {
  name: 'AquaFlux',
  description: 'Advanced DeFi Liquidity & Trading Platform',
  url: getAppUrl(),
  icons: [`${getAppUrl()}/favicon.ico`]
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: networks[0],
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#03c9e6',
    '--w3m-color-mix': '#18181b',
    '--w3m-color-mix-strength': 90,
    '--w3m-border-radius-master': '12px',
    '--w3m-z-index': 10000,
    '--w3m-font-family': 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    '--w3m-font-size-master': '10px',
  },
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    onramp: false
  }
})

interface ReownProviderProps {
  children: ReactNode
  cookies?: string | null
  initialState?: State
}

export function ReownProvider({ 
  children, 
  cookies,
  initialState 
}: ReownProviderProps) {
  const state = initialState || (cookies ? cookieToInitialState(wagmiAdapter.wagmiConfig, cookies) : undefined)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={state}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}