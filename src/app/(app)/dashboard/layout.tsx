import { Viewport, Metadata } from 'next'
import { RouteProvider } from '@/components/providers/route-provder'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SidebarLayout } from './SidebarLayout'

export const viewport: Viewport = {
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: 'Dashboard - Portfolio Overview',
  description: 'Monitor your DeFi portfolio performance, track Flux tokens, view real-time price charts, and manage your liquidity positions. Access comprehensive analytics and transaction history in one unified dashboard.',
  keywords: 'DeFi dashboard, portfolio tracker, Flux tokens, liquidity management, crypto analytics, transaction history, yield tracking',
  openGraph: {
    title: 'AquaFlux Dashboard - Portfolio Management',
    description: 'Real-time portfolio tracking and DeFi analytics dashboard',
    type: 'website',
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-primary'>
      <RouteProvider>
        <ThemeProvider>
          <div className='bg-primary flex flex-col lg:flex-row'>
            <SidebarLayout>{children}</SidebarLayout>
          </div>
        </ThemeProvider>
      </RouteProvider>
    </div>
  )
}
