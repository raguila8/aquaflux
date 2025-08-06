import clsx from 'clsx'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={clsx('scroll-smooth', GeistSans.variable, GeistMono.variable)}
    >
      <body className='bg-zinc-950 antialiased'>{children}</body>
    </html>
  )
}
