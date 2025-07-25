import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { ContentPill } from '@/components/shared/ContentPill'
import { cn } from '@/lib/utils'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import longGradient from '@/images/long-gradient.png'
import avatar from '@/images/avatars/avatar-2.png'

import windowCode from '@/icons/nucleo/window-code-16.svg'
import magicWand from '@/icons/nucleo/magic-wand-16.svg'
import trendUp from '@/icons/nucleo/trend-up-16.svg'

const jobListings = [
  {
    category: 'Engineering',
    icon: windowCode,
    jobs: [
      {
        title: 'Staff Fullstack Engineer',
        location: 'Remote - United States',
      },
      {
        title: 'Senior - Front-End Developer',
        location: 'Remote - Europe',
      },
      {
        title: 'Intern - Security Analyst',
        location: 'Remote - North America',
      },
      {
        title: 'Senior - DevOps Engineer',
        location: 'Remote - South America',
      },
    ],
  },
  {
    category: 'Product and Design',
    icon: magicWand,
    jobs: [
      {
        title: 'Executive Product Manager',
        location: 'Remote - Anywhere on Earth',
      },
      {
        title: 'Senior - UX/UI Designer',
        location: 'Remote - North America',
      },
      {
        title: 'Entry - Graphic Designer',
        location: 'Remote - Europe',
      },
    ],
  },
  {
    category: 'Sales and Marketing',
    icon: trendUp,
    jobs: [
      {
        title: 'Digital Marketing Specialist',
        location: 'Remote - South America',
      },
      {
        title: 'Sales Representative',
        location: 'Remote - United States',
      },
      {
        title: 'Content Strategist',
        location: 'Remote - Asia',
      },
    ],
  },
]

export function OpenPositions() {
  return (
    <section className='relative overflow-hidden py-20 sm:py-24'>
      <div className='absolute -top-96 bottom-48 left-0 right-80 -z-10'>
        <Image
          src={longGradient}
          alt=''
          className='h-full w-full object-contain object-center opacity-60'
          sizes='(max-width: 768px) 100vw, 1024px'
        />
      </div>

      <div className='absolute -bottom-96 -right-2/3 left-0 top-1/2 -z-10'>
        <Image
          src={longGradient}
          alt=''
          className='h-full w-full object-contain object-center opacity-50'
          sizes='(max-width: 768px) 100vw, 1024px'
        />
      </div>

      <Container className='max-w-4xl'>
        {/* Text content */}
        <div className='relative flex flex-col'>
          <h1 className='text-4xl font-bold leading-extratight text-violet-100 sm:text-5xl sm:leading-extratight'>
            <span className='relative inline-block text-nowrap'>
              <span className='relative z-10 bg-linear-to-b from-violet-400 via-violet-400 to-violet-500 bg-clip-text text-transparent'>
                Craft your future
              </span>
              <span className='absolute -top-px left-0 -z-10 text-violet-300'>
                Craft your future
              </span>
            </span>
            &nbsp;with us.&nbsp;
            <br className='hidden md:block' />
            Redefine remote work.
          </h1>
          <p className='mt-5 max-w-xl text-lg leading-8 text-zinc-200'>
            If you&apos;re passionate about shaping the future of remote work
            with cutting-edge solutions, Nebula is your launchpad. Let&apos;s
            create software that orbits beyond the conventional, together
          </p>
        </div>

        {/* Job listings */}
        <div className='mt-16 space-y-16 sm:mt-24'>
          {jobListings.map((jobsGroup) => (
            <div key={`jobs-${jobsGroup.category}`} className='space-y-6'>
              <ContentPill Icon={jobsGroup.icon} text={jobsGroup.category} />
              <ul role='list'>
                {jobsGroup.jobs.map((job, index) => (
                  <li
                    key={`jobs-${jobsGroup.category}-${index}`}
                    className='relative bg-zinc-950/[.01] shadow-inner-blur first:rounded-t-2xl last:rounded-b-2xl'
                  >
                    <div
                      className={cn(
                        'flex items-center justify-between space-x-3 border border-violet-200/[.06] border-t-transparent p-6 md:space-x-4 md:p-8',
                        index === 0 &&
                          'rounded-t-2xl border-b-violet-200/[.06] border-t-violet-200/[.06]',
                        jobsGroup.jobs.length - 1 === index && 'rounded-b-2xl'
                      )}
                    >
                      <div className='flex sm:w-2/5'>
                        <p className='text-[15px] font-semibold text-violet-100 md:text-base'>
                          {job.title}
                        </p>
                      </div>
                      <div className='flex items-center justify-between space-x-4 sm:w-3/5'>
                        <p className='hidden text-[15px] font-medium text-zinc-400 sm:block md:text-base'>
                          {job.location}
                        </p>
                        <a
                          href='#'
                          className='flex items-center text-sm font-semibold leading-4 text-violet-400 duration-200 ease-in-out hover:text-violet-300'
                        >
                          <span className='absolute inset-x-0 -top-px bottom-0 sm:hidden' />
                          <p className='hidden items-center sm:flex'>
                            Apply
                            <span className='ml-1 hidden md:block'> today</span>
                          </p>
                          <ChevronRightIcon className='ml-2 h-5 w-5 text-violet-300 duration-200 ease-in-out sm:h-4 sm:w-4' />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className='mx-auto mt-16 flex max-w-4xl flex-col items-center sm:mt-24 lg:mt-32'>
          <p className='text-center text-xl font-semibold leading-8 text-violet-50 sm:text-2xl sm:leading-9'>
            “Nebula has not only given me the platform to excel in my coding
            skills but also the flexibility to work from anywhere. I've grown
            more in my years here than I did in my entire career previously.”
          </p>
          <div className='mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(to_top_right,rgba(113,113,122,0.3),rgba(24,24,27,1)),linear-gradient(rgba(9,9,11,0.5),rgba(9,9,11,0.5))] sm:mt-10'>
            <Image
              className='h-[46px] w-[46px] rounded-full object-cover'
              src={avatar}
              alt='Nina Tucker'
            />
          </div>
          <div className='mt-3.5 flex items-center space-x-2.5'>
            <span className='font-semibold text-violet-50'>Nina Tucker</span>
            <span className='h-1 w-1 rounded-full bg-violet-50'></span>
            <span className='text-zinc-400'>Software Engineer</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
