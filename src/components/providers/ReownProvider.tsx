'use client'

import { ReactNode } from 'react'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, State } from 'wagmi'
import { wagmiAdapter, projectId, networks } from '@/config/reown'

const queryClient = new QueryClient()

const metadata = {
  name: 'AquaFlux',
  description: 'Advanced DeFi Liquidity & Trading Platform',
  url: 'https://aquaflux.tech',
  icons: ['https://aquaflux.tech/favicon.ico']
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: networks[0],
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#7B3FF2',
    '--w3m-color-mix-strength': 30,
    '--w3m-accent': '#7B3FF2',
    '--w3m-border-radius-master': '8px'
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