import { HeroContainer } from '@/components/shared/HeroContainer'
import { PricingHero } from '@/components/pricing/PricingHero'
import { PricingTable } from '@/components/pricing/PricingTable'
import { Faq } from '@/components/shared/Faq'
import { Divider } from '@/components/shared/Divider'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Pricing',
  description:
    'Nebula offers scalable pricing plans to suit your remote work requirements. Choose the plan that fits your team best.',
}

export default function Pricing() {
  return (
    <>
      <HeroContainer
        starField={false}
        bgGradientClassName='opacity-60 lg:opacity-90 xl:opacity-100'
      >
        <PricingHero />
      </HeroContainer>
      <Divider />
      <PricingTable />
      <Divider />
      <Faq />
      <Divider />
      <Footer />
    </>
  )
}
