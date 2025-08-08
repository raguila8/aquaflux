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
  keywords: ['DeFi', 'Liquidity', 'Trading', 'Decentralized Finance', 'Crypto', 'Blockchain', 'Base Chain', 'Automated Trading', 'Machine Learning', 'AquaFlux'],
  authors: [{ name: 'AquaFlux Team' }],
  creator: 'AquaFlux',
  publisher: 'AquaFlux',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AquaFlux - Advanced DeFi Liquidity & Trading Platform',
    description: 'Experience the future of decentralized finance with AquaFlux. Intelligent liquidity provision, machine learning-powered trading strategies, and consistent returns across all market conditions.',
    url: 'https://aquaflux.io',
    siteName: 'AquaFlux',
    images: [
      {
        url: 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/app-screenshot.avif',
        width: 1200,
        height: 630,
        alt: 'AquaFlux - Advanced DeFi Platform',
        type: 'image/avif',
      },
      {
        url: 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/aquaflux-logo.avif',
        width: 512,
        height: 512,
        alt: 'AquaFlux Logo',
        type: 'image/avif',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaFlux - Advanced DeFi Liquidity & Trading Platform',
    description: 'Experience the future of decentralized finance with AquaFlux. Intelligent liquidity provision and ML-powered trading strategies.',
    images: ['https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/app-screenshot.avif'],
    creator: '@aquaflux',
    site: '@aquaflux',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://aquaflux.io',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
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
      <head>
        <link rel="preconnect" href="https://base-mainnet.g.alchemy.com" />
        <link rel="dns-prefetch" href="https://base-mainnet.g.alchemy.com" />
        <link rel="preconnect" href="https://base-sepolia.g.alchemy.com" />
        <link rel="dns-prefetch" href="https://base-sepolia.g.alchemy.com" />
      </head>
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
