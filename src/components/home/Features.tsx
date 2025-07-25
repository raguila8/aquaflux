import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { StarField } from '@/components/shared/StarField'
import {
  UsersIcon,
  CursorArrowRippleIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'

import graphic from '@/images/features-graphic.png'
import cosmicButterfly from '@/images/cosmic-butterfly.png'
import spaceSpotlight from '@/images/space-spotlight.png'

const features = [
  {
    icon: UsersIcon,
    title: 'Team collaboration.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
  {
    icon: CursorArrowRippleIcon,
    title: 'Real time updates.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure sharing.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
  {
    icon: PresentationChartLineIcon,
    title: 'Analytics Insight.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Efficient Communication.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
  {
    icon: SparklesIcon,
    title: 'Time-Saving Automation.',
    description:
      'Seasonal latte black java dark blue fair grounds barista black origin french caffeine.',
  },
]

export function Features() {
  return (
    <section className='relative overflow-hidden'>
      <Container className='pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24'>
        {/* Text content */}
        <div className='relative flex flex-col items-center'>
          <h1 className='max-w-5xl text-center text-4xl font-bold leading-extratight text-violet-100 sm:text-5xl sm:leading-extratight'>
            Connect, Create and Collaborate,
            <span className='relative inline-block text-nowrap'>
              <span className='relative z-10 bg-linear-to-b from-violet-400 via-violet-400 to-violet-500 bg-clip-text text-transparent'>
                Effortlessly
              </span>
              <span className='absolute -top-px left-0 -z-10 text-violet-300'>
                Effortlessly
              </span>
            </span>
          </h1>
          <p className='mt-5 max-w-xl text-center text-lg leading-8 text-zinc-200'>
            Iced pumpkin mug in ut shop a doppio panna milk press americano cup
            bar fair, lait that galão irish redeye galão.
          </p>
        </div>

        {/* Graphic */}
        <div className='relative mt-10 w-full rounded-xl border border-violet-200/[.08] bg-white/[.01] p-1 shadow-inner-blur sm:mt-16 sm:rounded-2xl sm:p-2 lg:mt-18'>
          <div className='absolute -left-56 -right-56 -top-80 -z-10 sm:-left-48 sm:-right-48 md:left-1/2 md:w-full md:max-w-6xl md:-translate-x-1/2 lg:-top-96'>
            <Image
              src={spaceSpotlight}
              alt=''
              className='h-full w-full object-contain'
              sizes='(max-width: 768px) 100vw, 1152px'
            />
          </div>

          {/* Stars */}
          <div
            className='absolute -top-48 left-1/2 -z-10 h-56 w-full max-w-3xl -translate-x-1/2'
            aria-hidden='true'
          >
            <StarField density='medium' maxRadius={2.25} />
          </div>
          <div className='absolute -bottom-96 -left-96 -right-96 top-0 -z-10'>
            <Image
              src={cosmicButterfly}
              alt=''
              className='h-full w-full object-contain opacity-10'
              sizes='(max-width: 1024px) 100vw, 1024px'
            />
          </div>

          <Image
            src={graphic}
            alt='Collaboration interface with user profile images'
            className='relative h-auto w-full rounded-lg'
            sizes='(max-width: 1024px) 100vw'
          />
        </div>

        {/* Features */}
        <div className='relative mx-auto mt-10 grid max-w-lg grid-cols-1 gap-x-6 gap-y-5 sm:mt-16 sm:max-w-2xl sm:grid-cols-2 sm:gap-y-9 md:mt-18 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {features.map((feature, index) => (
            <div key={`feature-${index}`}>
              <feature.icon className='-mt-0.5 mr-1.5 inline h-5 w-5 shrink-0 text-violet-400 sm:h-[21px] sm:w-[21px]' />
              <p className='inline text-[17px] leading-7 text-zinc-300 md:text-lg md:leading-8'>
                <span className='font-semibold text-white'>
                  {feature.title}
                </span>{' '}
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
