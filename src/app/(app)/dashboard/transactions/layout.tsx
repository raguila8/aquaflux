import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transactions - Trading History',
  description: 'Complete transaction history and trading activity. Track all your DeFi transactions, swaps, liquidity provisions, and yield farming activities. Filter, search, and export your complete trading history.',
  keywords: 'DeFi transactions, trading history, swap history, liquidity transactions, yield farming history, transaction tracking, crypto activity',
  openGraph: {
    title: 'AquaFlux Transactions - Complete Trading History',
    description: 'Track and manage all your DeFi transactions in one place',
    type: 'website',
  },
}

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}