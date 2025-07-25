import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { cn } from '@/lib/utils'

import avatar1 from '@/images/avatars/avatar-1.png'
import avatar2 from '@/images/avatars/avatar-2.png'
import avatar3 from '@/images/avatars/avatar-3.png'
import avatar4 from '@/images/avatars/avatar-4.png'
import avatar5 from '@/images/avatars/avatar-5.png'
import avatar6 from '@/images/avatars/avatar-6.png'
import avatar7 from '@/images/avatars/avatar-7.png'
import avatar8 from '@/images/avatars/avatar-8.png'
import avatar9 from '@/images/avatars/avatar-9.png'
import avatar10 from '@/images/avatars/avatar-10.png'
import avatar11 from '@/images/avatars/avatar-11.png'
import avatar12 from '@/images/avatars/avatar-12.png'
import spaceSpotlight from '@/images/space-spotlight.png'

const team = [
  [
    {
      avatar: avatar1,
      name: 'Ethan Long',
      title: 'Founder & CEO',
    },
    {
      avatar: avatar2,
      name: 'Nina Tucker',
      title: 'Lead Developer',
    },
    {
      avatar: avatar3,
      name: 'Olivia Simmons',
      title: 'Product Designer',
    },
    {
      avatar: avatar4,
      name: 'Sophia Johnson',
      title: 'Marketing Manager',
    },
    {
      avatar: avatar5,
      name: 'Ava Hill',
      title: 'Customer Success Manager',
    },
    {
      avatar: avatar6,
      name: 'Emma López',
      title: 'Operations Manager',
    },
  ],
  [
    {
      avatar: avatar7,
      name: 'Isabella Martinez',
      title: 'Software Engineer',
    },
    {
      avatar: avatar8,
      name: 'Jackson Patel',
      title: 'Product Manager',
    },
    {
      avatar: avatar9,
      name: 'Mia Zhang',
      title: 'Data Analyst',
    },
    {
      avatar: avatar10,
      name: 'Rachel Green',
      title: 'UX Designer',
    },
    {
      avatar: avatar11,
      name: 'Liam Smith',
      title: 'Sales Manager',
    },
    {
      avatar: avatar12,
      name: 'Emily Parker',
      title: 'Content Writer',
    },
  ],
]

export function Team() {
  return (
    <section className='relative overflow-hidden py-20 sm:py-24'>
      <Container>
        {/* Text content */}
        <div className='relative flex flex-col'>
          <h1 className='text-4xl font-bold leading-extratight text-violet-100 sm:text-5xl sm:leading-extratight'>
            Meet the&nbsp;
            <span className='relative inline-block text-nowrap'>
              <span className='relative z-10 bg-linear-to-b from-violet-400 via-violet-400 to-violet-500 bg-clip-text text-transparent'>
                Innovators
              </span>
              <span className='absolute -top-px left-0 -z-10 text-violet-300'>
                Innovators
              </span>
            </span>
            <br />
            Fueling Nebula&apos;s Mission
          </h1>
        </div>
      </Container>

      {/* Team */}
      <div className='relative mt-14 space-y-7 sm:mt-16'>
        <div className='absolute -left-96 -right-96 -top-80 -z-10 sm:-left-96 sm:-right-96 md:left-1/2 md:w-full md:max-w-7xl md:-translate-x-1/2 lg:-top-96'>
          <Image
            src={spaceSpotlight}
            alt=''
            className='h-full w-full object-contain opacity-40'
            sizes='(max-width: 768px) 100vw, 1152px'
          />
        </div>

        <div className='absolute -left-96 -right-96 -z-10 translate-y-1/2 sm:-left-96 sm:-right-96 md:left-full md:w-full md:max-w-7xl md:-translate-x-3/4 lg:bottom-0'>
          <Image
            src={spaceSpotlight}
            alt=''
            className='h-full w-full object-contain opacity-25'
            sizes='(max-width: 768px) 100vw, 1152px'
          />
        </div>
        <div className='space-y-5'>
          {team.map((row, rowIndex) => (
            <div
              key={`team-row-${rowIndex}`}
              className={cn(
                'mx-2.5 flex w-max animate-infiniteScroll items-center justify-center',
                rowIndex % 2 != 0 && '[animation-direction:reverse]'
              )}
            >
              {[...Array(2)].map((_, i) => (
                <div
                  key={`team-row-${rowIndex}-${i}`}
                  className='flex w-1/2 justify-around'
                >
                  {row.map((member, j) => (
                    <div
                      key={`team-row-${rowIndex}-${i}-member-${j}`}
                      className='mx-2.5 w-80 rounded-2xl bg-zinc-950/[.01] shadow-inner-blur'
                    >
                      <div className='flex h-full w-full flex-col rounded-2xl border border-violet-200/[.06] p-5'>
                        <div className='flex items-center'>
                          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(to_top_right,rgba(113,113,122,0.3),rgba(24,24,27,1)),linear-gradient(rgba(9,9,11,0.5),rgba(9,9,11,0.5))]'>
                            <Image
                              className='h-[42px] w-[42px] rounded-full object-cover'
                              src={member.avatar}
                              alt={member.name}
                            />
                          </div>
                          <div className='ml-2.5 flex flex-col justify-center'>
                            <span className='text-sm font-semibold text-white'>
                              {member.name}
                            </span>
                            <span className='text-sm font-medium text-zinc-400'>
                              {member.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
