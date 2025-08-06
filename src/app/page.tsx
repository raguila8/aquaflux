import { HeroContainer } from '@/components/shared/HeroContainer'
import { HomeHero } from '@/components/home/HomeHero'
import { Divider } from '@/components/shared/Divider'
import { BentoGridSection } from '@/components/home/BentoGridSection'
import { Integrations } from '@/components/home/Integrations'
import { Footer } from '@/components/shared/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AquaFlux - Advanced DeFi Liquidity & Trading Platform',
  description: 'Experience the future of decentralized finance with AquaFlux. Intelligent liquidity provision, machine learning-powered trading strategies, and consistent returns across all market conditions. Join the next generation of DeFi.',
  keywords: 'DeFi, decentralized finance, liquidity provision, cryptocurrency trading, blockchain, Balancer, yield farming, automated trading, machine learning trading',
  openGraph: {
    title: 'AquaFlux - Advanced DeFi Liquidity & Trading Platform',
    description: 'Intelligent liquidity provision and ML-powered trading for consistent DeFi returns',
    type: 'website',
    url: 'https://aquaflux.io',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AquaFlux Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaFlux - Advanced DeFi Platform',
    description: 'Intelligent liquidity provision and ML-powered trading for consistent returns',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return (
    <>
      <HeroContainer>
        <HomeHero />
      </HeroContainer>
      <Divider />
      <BentoGridSection />
      <Divider />
      <Integrations />
      <Divider />
      <Footer />
    </>
  )
}
