import Image from 'next/image'
import { StarField } from '@/components/shared/StarField'
import { cn } from '@/lib/utils'

import fictionalLogo01 from '@/images/logos/fictional-logo-01.svg'
import fictionalLogo02 from '@/images/logos/fictional-logo-02.svg'
import fictionalLogo03 from '@/images/logos/fictional-logo-03.svg'
import fictionalLogo04 from '@/images/logos/fictional-logo-04.svg'
import fictionalLogo05 from '@/images/logos/fictional-logo-05.svg'
import fictionalLogo06 from '@/images/logos/fictional-logo-06.svg'
import fictionalLogo07 from '@/images/logos/fictional-logo-07.svg'
import cosmicButterfly from '@/images/cosmic-butterfly.png'

const companies = [
  {
    name: 'Fictional logo 01',
    logo: fictionalLogo01,
    href: '#',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.025] sm:after:from-transparent after:to-violet-200/[0.075] sm:after:to-violet-200/[0.125]',
  },
  {
    name: 'Fictional logo 02',
    logo: fictionalLogo02,
    href: '#',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.075] after:to-violet-200/[0.15] lg:after:to-violet-200/[0.25] sm:after:via-violet-200/[0.25] sm:after:to-violet-200/[0.125] lg:after:via-violet-200/[0.1875] before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.01] before:to-violet-200/[0.075] sm:before:to-violet-200/[0.125]',
  },
  {
    name: 'Fictional logo 03',
    logo: fictionalLogo03,
    href: '#',
    borderClassName:
      'after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r lg:after:from-violet-200/[0.25] lg:after:to-violet-200/[0.125] after:from-violet-200/[0.15] after:to-violet-200/[0.075] sm:after:from-violet-200/[0.125] sm:after:to-transparent sm:before:block before:hidden before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.015] lg:before:to-violet-200/[0.25] before:to-violet-200/[0.125]',
  },
  {
    name: 'Fictional logo 04',
    logo: fictionalLogo04,
    href: '#',
    borderClassName:
      'sm:hidden lg:block after:inset-x-0 after:bottom-0 after:h-px after:w-full after:bg-linear-to-r after:from-violet-200/[0.075] after:to-violet-200/[0.025] lg:after:from-violet-200/[0.125] lg:after:to-transparent before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b sm:before:from-violet-200/[.01] sm:before:to-violet-200/[0.125] before:from-violet-200/[0.075] before:to-violet-200/[0.025]',
  },
  {
    name: 'Fictional logo 05',
    logo: fictionalLogo05,
    href: '#',
    borderClassName:
      'after:hidden sm:after:block after:content-[""] after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full',
  },
  {
    name: 'Fictional logo 06',
    logo: fictionalLogo06,
    href: '#',
    borderClassName:
      'before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b lg:before:from-violet-200/[.125] before:from-violet-200/[.025] before:to-violet-200/[.15] sm:before:from-violet-200/[.25] sm:before:to-violet-200/[0.01] after:content-[""] after:hidden sm:after:block after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full',
  },
  {
    name: 'Fictional logo 07',
    logo: fictionalLogo07,
    href: '#',
    borderClassName:
      'hidden lg:block before:content-[""] before:absolute before:left-0 before:h-full before:w-px before:bg-linear-to-b before:from-violet-200/[.125] before:to-violet-200/[0.01] after:content-[""] after:absolute after:w-1.5 after:h-1.5 after:bg-violet-200 after:top-[-3.5px] after:left-1/2 after:translate-x-[-2.5px] after:rounded-full',
  },
]

type Props = React.HTMLAttributes<HTMLDivElement>

export function Investors({ className, ...props }: Props) {
  return (
    <div className={cn('relative sm:px-10', className)} {...props}>
      <div className='absolute -left-96 -right-96 -top-96 bottom-0 -z-10'>
        <Image
          src={cosmicButterfly}
          alt=''
          className='h-[calc(100%_+_384px)] w-[calc(100%_+_768px)] opacity-15'
          sizes='(max-width: 768px) 100vw, 1024px'
        />
      </div>
      <p className='text-center text-[13px] font-extrabold uppercase tracking-widest text-violet-50/80 sm:text-sm'>
        Funded by industry leading investors
      </p>

      {/* Logos */}
      <div className='relative mt-8 flex flex-wrap items-center justify-center'>
        {companies.map((company) => (
          <a
            key={`investor-${company.name}`}
            href={company.href}
            className={cn(
              "group relative w-1/2 cursor-pointer bg-linear-to-b after:absolute after:content-[''] sm:w-1/3 lg:w-1/4",
              company.borderClassName
            )}
          >
            <div className='relative h-full w-full overflow-hidden'>
              <div
                className='absolute inset-0 opacity-0 duration-300 ease-in-out group-hover:opacity-100'
                aria-hidden='true'
              >
                <StarField density='high' maxRadius={1.75} minRadius={1} />
              </div>
              <div className='hover-gradient absolute inset-0 -z-10 bg-linear-to-b from-[#575EFF]/50 to-[#E478FF]/50 opacity-0 blur-4xl duration-300 ease-in-out group-hover:opacity-100' />
              <div className='relative flex h-full w-full items-center justify-center py-16 md:py-[72px] xl:py-20'>
                <company.logo className='absolute z-10 h-9 w-auto md:h-10 lg:h-11 xl:h-12' />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
