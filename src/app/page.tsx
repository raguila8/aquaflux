import { HeroContainer } from '@/components/shared/HeroContainer'
import { HomeHero } from '@/components/home/HomeHero'
import { Divider } from '@/components/shared/Divider'
import { BentoGridSection } from '@/components/home/BentoGridSection'
import { InteractiveCodeSection } from '@/components/home/InteractiveCodeSection'
import { Integrations } from '@/components/home/Integrations'
import { Features } from '@/components/home/Features'
import { Testimonials } from '@/components/home/Testimonials'
import { Footer } from '@/components/shared/Footer'

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
