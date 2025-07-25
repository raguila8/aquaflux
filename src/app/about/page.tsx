import { HeroContainer } from '@/components/shared/HeroContainer'
import { AboutHero } from '@/components/about/AboutHero'
import { StoryWithValues } from '@/components/about/StoryWithValues'
import { Team } from '@/components/about/Team'
import { WorkCulture } from '@/components/about/WorkCulture'
import { OpenPositions } from '@/components/about/OpenPositions'
import { Divider } from '@/components/shared/Divider'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'About',
  description:
    "Explore Nebula's journey and mission to enhance remote work. Discover our culture, values, and careers.",
}

export default function About() {
  return (
    <>
      <HeroContainer bgGradientClassName='bottom-0 h-[calc(100%_+_320px)]'>
        <AboutHero />
      </HeroContainer>
      <Divider />
      <StoryWithValues />
      <Divider />
      <Team />
      <Divider />
      <WorkCulture />
      <Divider />
      <OpenPositions />
      <Divider />
      <Footer />
    </>
  )
}
