import { HeroContainer } from '@/components/shared/HeroContainer'
import { ContactHero } from '@/components/contact/ContactHero'
import { PopularLinks } from '@/components/contact/PopularLinks'
import { Faq } from '@/components/shared/Faq'
import { Divider } from '@/components/shared/Divider'
import { Footer } from '@/components/shared/Footer'

export const metadata = {
  title: 'Contact',
  description:
    "Need assistance or have questions? Contact Nebula's team for prompt support and information.",
}

export default function Contact() {
  return (
    <>
      <HeroContainer
        className='overflow-visible overflow-x-clip'
        bgGradientClassName='inset-x-0 bottom-0 -top-32 opacity-80 sm:opacity-100'
      >
        <ContactHero />
      </HeroContainer>
      <Divider />
      <PopularLinks />
      <Divider />
      <Faq />
      <Divider />
      <Footer />
    </>
  )
}
