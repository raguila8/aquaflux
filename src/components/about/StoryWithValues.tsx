import Image from 'next/image'
import { StarField } from '@/components/shared/StarField'
import { ContentPill } from '@/components/shared/ContentPill'
import { BuildingOffice2Icon } from '@heroicons/react/16/solid'

import spaceSpotlight from '@/images/space-spotlight.png'
import teamPhoto from '@/images/team-photo.jpg'
import cosmicButterfly from '@/images/cosmic-butterfly-2.svg?url'

import logic from '@/icons/nucleo/logic-24-colored.svg'
import meeting from '@/icons/nucleo/meeting-24-colored.svg'
import globe from '@/icons/nucleo/globe-24-colored.svg'
import wateringPlants from '@/icons/nucleo/watering-plants-24-colored.svg'

const values = [
  {
    title: 'Commitment to Excellence',
    description:
      'Our dedication to excellence is unwavering. Nebula strives for the highest quality in every innovation and service we deliver.',
    icon: logic,
  },
  {
    title: 'Collaboration at Core',
    description:
      'We believe in the power of collective intelligence. Collaboration is the heartbeat of our company culture and platform design.',
    icon: meeting,
  },
  {
    title: 'Global Empathy',
    description:
      'Understanding global needs drives us forward. Nebula is committed to fostering an inclusive environment, embracing diverse perspectives.',
    icon: globe,
  },
  {
    title: 'Sustainable Growth',
    description:
      'Growth at Nebula is nurtured sustainably. We invest in long-term development, ensuring our impact is positive and enduring.',
    icon: wateringPlants,
  },
]

export function StoryWithValues() {
  return (
    <section
      id='about-story'
      className='relative overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.95),rgba(24,24,27,0.95)),linear-gradient(#2E1065,#2E1065)] py-20 sm:py-24 lg:py-28 xl:py-40'
    >
      <div className='absolute left-0 top-0 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain'
          sizes='(max-width: 1024px) 100vw, 1280px'
        />
      </div>

      {/* Stars */}
      <div className='absolute left-0 top-0 z-0 h-72 w-72' aria-hidden='true'>
        <StarField density='high' maxRadius={2.5} minRadius={1.25} />
      </div>
      <div className='mx-auto max-w-lg px-5 sm:max-w-2xl sm:px-6 lg:grid lg:max-w-(--breakpoint-xl) lg:grid-cols-12 lg:gap-14 lg:px-8 xl:gap-16 2xl:gap-20'>
        <div className='flex items-center lg:col-span-7'>
          <div className='relative z-10 flex flex-col'>
            <ContentPill Icon={BuildingOffice2Icon} text='Who we are' />
            <h2 className='mt-5 text-4xl font-bold leading-extratight text-violet-100 lg:text-[2.75rem] xl:leading-extratight'>
              Nebula was born from a simple vision
            </h2>

            {/* Text content */}
            <div className='mt-6'>
              <p className='text-lg leading-8 text-zinc-300 lg:text-[17px] xl:text-lg xl:leading-8'>
                Nebula was born from a simple vision — to create a world where
                distance and time zones do not hinder collaboration and
                innovation. Our cloud-based platform is the cornerstone of this
                vision, designed to bring together diverse minds and talents
                seamlessly. From our early days as a startup to our current
                status as a global facilitator of remote work, Nebula’s journey
                is one of relentless pursuit of excellence and empowerment.
              </p>
              <p className='mt-8 text-lg leading-8 text-zinc-300 lg:text-[17px] lg:leading-8 xl:text-lg xl:leading-8'>
                As we evolved, our core belief remained steadfast—to empower
                every organization with the tools to thrive in a global
                landscape. Nebula stands not just as a platform, but as a
                testament to the collaborative spirit, driving progress and
                fostering unity across continents.
              </p>
            </div>

            {/* Team photo */}
            <div className='relative mt-12 h-96 w-full -rotate-2 rounded-2xl bg-white/[.01] shadow-inner-blur sm:mt-14'>
              <div className='h-full w-full rounded-2xl border border-violet-200/[.08] p-2'>
                <div className='absolute -bottom-48 -left-48 -right-16 -top-36'>
                  <Image
                    src={cosmicButterfly}
                    alt=''
                    className='h-full w-full object-fill'
                  />
                </div>

                <Image
                  src={teamPhoto}
                  alt='Two men chatting and smiling in a casual workspace'
                  className='relative h-full w-full rounded-lg object-cover'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-16 flex flex-col justify-center space-y-16 sm:mt-20 lg:col-span-5 lg:mt-0'>
          {values.map((value) => (
            <div key={`value-${value.title}`} className='w-full px-2'>
              <div className='h-11 w-11 rounded-lg bg-zinc-950/[.01] shadow-btn-secondary'>
                <div className='flex h-full w-full items-center justify-center rounded-lg border border-violet-200/[.04]'>
                  <value.icon className='h-4.5 w-4.5 text-zinc-200/95' />
                </div>
              </div>

              <h3 className='mt-4 text-lg font-bold leading-8 text-white'>
                {value.title}
              </h3>

              <p className='mt-1.5 text-lg leading-8 text-zinc-300'>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
