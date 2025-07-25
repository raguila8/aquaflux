import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { StarField } from '@/components/shared/StarField'
import { ContentPill } from '@/components/shared/ContentPill'
import { cn } from '@/lib/utils'

import cosmicButterfly from '@/images/cosmic-butterfly.png'
import spaceSpotlight from '@/images/space-spotlight.png'
import photo01 from '@/images/employee-insta-photo-01.jpeg'
import photo02 from '@/images/employee-insta-photo-02.jpeg'
import photo03 from '@/images/employee-insta-photo-03.jpeg'
import photo04 from '@/images/employee-insta-photo-04.jpeg'
import photo05 from '@/images/employee-insta-photo-05.jpeg'
import photo06 from '@/images/employee-insta-photo-06.jpeg'
import photo07 from '@/images/employee-insta-photo-07.jpeg'
import photo08 from '@/images/employee-insta-photo-08.jpeg'

import globePin from '@/icons/nucleo/globe-pin-32-colored.svg'
import heartbeat from '@/icons/nucleo/heartbeat-32-colored.svg'
import bulb from '@/icons/nucleo/bulb-32-colored.svg'
import palmTree from '@/icons/nucleo/palm-tree-32-colored.svg'
import computerGear from '@/icons/nucleo/computer-gear-32-colored.svg'
import mountain from '@/icons/nucleo/mountain-32-colored.svg'
import babyStroller from '@/icons/nucleo/baby-stroller-32-colored.svg'

import usaFlag from '@/icons/nucleo/flags/usa.svg'
import portugalFlag from '@/icons/nucleo/flags/portugal.svg'
import turkeyFlag from '@/icons/nucleo/flags/turkey.svg'
import australiaFlag from '@/icons/nucleo/flags/australia.svg'
import greeceFlag from '@/icons/nucleo/flags/greece.svg'
import newZealandFlag from '@/icons/nucleo/flags/new-zealand.svg'

const careerBenefits = [
  {
    title: 'Remote Flexibility',
    icon: globePin,
    description: 'Work from home, a cafe, or even under the stars.',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.025] md:after:from-transparent after:to-violet-200/[0.075] md:after:to-violet-200/[0.125]',
  },
  {
    title: 'Wellness Programs',
    icon: heartbeat,
    description: 'Enjoy health coverage and mental wellness benefits.',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.075] after:to-violet-200/[0.15] lg:after:to-violet-200/[0.25] md:after:via-violet-200/[0.25] md:after:to-violet-200/[0.125] lg:after:via-violet-200/[0.1875] before:content-[""] before:hidden sm:before:block before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.01] before:to-violet-200/[0.075] md:before:to-violet-200/[0.125]',
  },
  {
    title: 'Professional Growth',
    icon: bulb,
    description: 'Courses and networks that boost your career.',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r lg:after:from-violet-200/[0.25] lg:after:to-violet-200/[0.125] after:from-violet-200/[0.15] after:to-violet-200/[0.075] md:after:from-violet-200/[0.125] md:after:to-transparent md:before:block before:hidden before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.015] lg:before:to-violet-200/[0.25] before:to-violet-200/[0.125]',
  },
  {
    title: 'Vacation Policy',
    icon: palmTree,
    description: 'Recharge with over 1 month of vacation a year.',
    borderClassName:
      'md:hidden before:hidden sm:before:block lg:block after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.075] after:to-violet-200/[0.025] lg:after:from-violet-200/[0.125] lg:after:to-transparent before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b md:before:from-violet-200/[.01] md:before:to-violet-200/[0.125] before:from-violet-200/[0.075] before:to-violet-200/[0.025]',
  },
  {
    title: 'Gear Allowance',
    icon: computerGear,
    description: 'We’ll send you the latest technology wherever.',
    borderClassName:
      'after:hidden md:after:block after:content-[""] after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full before:content-[""] before:absolute sm:before:hidden before:inset-x-0 before:bottom-0 before:h-px before:w-full before:bg-linear-to-r before:from-violet-200/[0.025] before:to-violet-200/[0.075]',
  },
  {
    title: 'Company Retreats',
    icon: mountain,
    description: 'All-expenses-paid retreats that blend work and play.',
    borderClassName:
      'before:content-[""] before:hidden sm:before:block before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b lg:before:from-violet-200/[.125] before:from-violet-200/[.025] before:to-violet-200/[.15] md:before:from-violet-200/[.25] md:before:to-violet-200/[0.01] after:content-[""] after:hidden md:after:block after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full',
  },
  {
    title: 'Family Leave',
    icon: babyStroller,
    description: 'Extended maternity and paternity leave options',
    borderClassName:
      'hidden lg:block before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.125] before:to-violet-200/[0.01] after:content-[""] after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full',
  },
]

const employeeInstaPhotos = [
  {
    image: photo01,
    alt: 'Two friends taking a selfie at a restaurant',
    username: '@sara_and_jane',
    caption: 'Besties night out! 🥂',
    flag: usaFlag,
    location: 'New York, USA',
  },
  {
    image: photo02,
    alt: 'Dinner party with friends',
    username: '@VeronicaReardon',
    caption: 'Lisbon crew enjoying a nice dinner together!',
    flag: portugalFlag,
    location: 'Lisbon, Portugal',
  },
  {
    image: photo03,
    alt: 'Man working on laptop in a cafe',
    username: '@dev_daniel',
    caption: 'Remote work with a perfect cup of coffee ☕',
    flag: usaFlag,
    location: 'San Francisco, USA',
  },
  {
    image: photo04,
    alt: 'Three friends jumping with hot air balloons in the background',
    username: '@adventure_girls',
    caption: 'Ballooning adventures! 🎈',
    flag: turkeyFlag,
    location: 'Cappadocia, Turkey',
  },
  {
    image: photo05,
    alt: 'Woman working at home with a dog by her side',
    username: '@urban_nature',
    caption: 'Work from home vibes 🌿',
    flag: usaFlag,
    location: 'Brooklyn, USA',
  },
  {
    image: photo06,
    alt: 'Yoga session in the park at sunset',
    username: '@yogi_life',
    caption: 'Finding peace in the sunset 🌅',
    flag: australiaFlag,
    location: 'Sydney, Australia',
  },
  {
    image: photo07,
    alt: 'Man working on a laptop in an outdoor setting',
    username: '@nomad_coder',
    caption: 'Work from anywhere 🌍',
    flag: greeceFlag,
    location: 'Santorini, Greece',
  },
  {
    image: photo08,
    alt: 'Woman using her phone with a beach view',
    username: '@coastal_life',
    caption: 'Ocean view office 🌊',
    flag: newZealandFlag,
    location: 'Auckland, New Zealand',
  },
]

export function WorkCulture() {
  return (
    <section className='relative overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-24'>
      <Container>
        {/* Text content */}
        <div className='relative flex flex-col items-center'>
          <h1 className='max-w-4xl text-center text-4xl font-bold leading-extratight text-violet-100 sm:text-5xl sm:leading-extratight'>
            Craft Your Career from&nbsp;
            <span className='relative inline-block text-nowrap'>
              <span className='relative z-10 bg-linear-to-b from-violet-400 via-violet-400 to-violet-500 bg-clip-text text-transparent'>
                Anywhere
              </span>
              <span className='absolute -top-px left-0 -z-10 text-violet-300'>
                Anywhere
              </span>
            </span>
            &nbsp;with Nebula
          </h1>
          <p className='mt-5 max-w-xl text-center text-lg leading-8 text-zinc-200'>
            Embark on a professional journey with Nebula where remote working
            isn&apos;t just an option—it&apos;s our culture.
          </p>
        </div>

        {/* Benefits */}
        <div className='relative mt-12 sm:mt-18'>
          <div className='absolute -left-56 -right-56 -top-80 sm:-left-64 sm:-right-64 lg:top-[-500px]'>
            <Image
              src={spaceSpotlight}
              alt=''
              className='-z-10 h-full w-full object-cover opacity-45'
              sizes='(max-width: 768px) 100vw, 1152px'
            />
          </div>

          <div className='relative mt-8 flex flex-wrap items-stretch justify-center'>
            {careerBenefits.map((benefit) => (
              <div
                key={`benefit-${benefit.title}`}
                className={cn(
                  "group relative w-full bg-linear-to-b after:absolute after:content-[''] sm:w-1/2 md:w-1/3 lg:w-1/4",
                  benefit.borderClassName
                )}
              >
                <div className='relative h-full w-full overflow-hidden'>
                  <div
                    className='absolute inset-0 opacity-0 duration-300 ease-in-out group-hover:opacity-100'
                    aria-hidden='true'
                  >
                    <StarField density='high' maxRadius={1.75} minRadius={1} />
                  </div>
                  <div className='hover-gradient absolute inset-0 -z-10 bg-linear-to-b from-[#575EFF]/30 to-[#E478FF]/30 opacity-0 blur-4xl duration-300 ease-in-out group-hover:opacity-100' />
                  <div className='relative z-10 flex h-full w-full flex-1 flex-col justify-center px-4 py-5 sm:px-5 sm:py-6 lg:py-7 xl:p-8'>
                    <benefit.icon className='h-6 w-6 text-zinc-300 sm:h-7 sm:w-7 xl:h-8 xl:w-8' />

                    <h4 className='mt-5 text-base font-bold text-violet-50 xl:mt-6 xl:text-lg'>
                      {benefit.title}
                    </h4>
                    <p className='mt-1 line-clamp-2 text-base text-zinc-300 xl:text-lg'>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Images */}
      <div className='mx-2.5 mt-14 flex sm:mt-16 lg:mt-20'>
        <div className='mx-2.5 flex w-max animate-infiniteScroll items-center justify-center [--_infinite-scroll-duration:80s]'>
          {[...Array(2)].map((_, i) => (
            <div
              key={`employee-photos-${i}`}
              className='flex w-1/2 justify-around'
            >
              {employeeInstaPhotos.map((photo, j) => (
                <div
                  key={`employee-photos-${i}-${j}`}
                  className='relative mx-2.5 aspect-4/5 w-60 shrink-0 rounded-2xl border border-violet-200/[.08] bg-white/[.01] p-2 shadow-inner-blur sm:w-64 md:w-72 lg:w-80 xl:w-96'
                >
                  <div className='absolute -bottom-16 -left-20 -right-20 -top-24 -z-50 md:-bottom-20 md:-left-24 md:-right-24 md:-top-32 lg:-left-32 lg:-right-32 lg:-top-44'>
                    <Image
                      src={cosmicButterfly}
                      alt=''
                      className='h-full w-full -rotate-6 opacity-25'
                    />
                  </div>

                  <Image
                    src={photo.image}
                    alt=''
                    className='relative h-full w-full rounded-lg object-cover mix-blend-luminosity'
                  />

                  <ContentPill
                    className='absolute right-4 top-4 bg-zinc-950/70'
                    innerClassName='px-3.5'
                    iconClassName='h-3 w-3'
                    textClassName='text-xs leading-none'
                    Icon={photo.flag}
                    text={photo.location}
                  />

                  <div className='absolute inset-x-2 bottom-2 rounded-b-lg bg-linear-to-b from-violet-950/10 via-violet-950/40 to-violet-950/55'>
                    <div className='px-4 py-8 md:px-5 lg:px-6 xl:px-8'>
                      <p className='text-lg font-bold text-white md:text-xl lg:text-2xl'>
                        {photo.username}
                      </p>
                      <p className='mt-1.5 text-base text-zinc-100 md:text-[17px] lg:text-lg'>
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
