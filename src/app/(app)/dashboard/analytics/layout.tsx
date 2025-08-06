import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics - Portfolio Performance',
  description: 'Deep dive into your DeFi portfolio analytics. View detailed allocation charts, Balancer v3 liquidity positions, performance metrics, and historical trends. Make data-driven decisions with comprehensive portfolio insights.',
  keywords: 'DeFi analytics, portfolio allocation, Balancer v3, liquidity analytics, performance metrics, crypto charts, yield analysis, APY tracking',
  openGraph: {
    title: 'AquaFlux Analytics - Advanced Portfolio Insights',
    description: 'Comprehensive DeFi portfolio analytics with allocation charts and performance metrics',
    type: 'website',
  },
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}