import clsx from 'clsx'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "@/styles/globals.css";
import { ReownProvider } from '@/components/providers/ReownProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/config/reown';

export const metadata: Metadata = {
  title: {
    template: '%s | AquaFlux',
    default: 'AquaFlux - Advanced DeFi Liquidity & Trading Platform',
  },
  description:
    'Experience the future of decentralized finance with AquaFlux. Intelligent liquidity provision, machine learning-powered trading strategies, and consistent returns across all market conditions.',
  metadataBase: new URL('https://aquaflux.io'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')
  const initialState = cookieToInitialState(config, cookies)

  return (
    <html
      lang='en'
      className={clsx('scroll-smooth', GeistSans.variable, GeistMono.variable)}
    >
      <body className='bg-zinc-950 antialiased'>
        <ReownProvider cookies={cookies} initialState={initialState}>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ReownProvider>
      </body>
    </html>
  )
}
