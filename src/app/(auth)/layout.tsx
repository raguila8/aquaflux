import Image from 'next/image'
import { HeroContainer } from '@/components/shared/HeroContainer'
import { Button } from '@/components/shared/Button'
import { Constellation } from '@/components/auth/Constellation'
import { XMarkIcon } from '@heroicons/react/24/solid'

import spaceSpotlight from '@/images/space-spotlight.png'
import cosmicButterfly from '@/images/cosmic-butterfly.png'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <HeroContainer
      header={false}
      className='flex min-h-screen items-center justify-center overflow-hidden py-16 sm:py-20'
      bgGradientClassName='-top-48 bottom-0 h-[calc(100%_+_320px)]'
      innerContainerClassName='w-full overflow-hidden sm:overflow-visible'
    >
      <div className='absolute -right-48 top-64 max-w-6xl translate-x-16 translate-y-full sm:top-96 sm:translate-y-1/3 md:right-0 md:w-full lg:top-0 lg:translate-x-1/4 lg:translate-y-0'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain opacity-50 lg:opacity-75'
          sizes='(max-width: 768px) 100vw, 1152px'
          priority
        />
      </div>

      <div className='absolute -left-96 -right-96 -top-96 bottom-0 -z-10'>
        <Image
          src={cosmicButterfly}
          alt=''
          className='h-[calc(100%_+_384px)] w-[calc(100%_+_768px)] opacity-10 lg:opacity-5'
          sizes='(max-width: 1024px) 100vw, 1024px'
          priority
        />
      </div>

      <Constellation />

      <Button
        href='/'
        variant='secondary'
        size='md'
        className='absolute right-4 top-4 hidden p-2 sm:flex lg:right-12 lg:top-12 lg:p-2.5'
      >
        <XMarkIcon className='h-4.5 w-4.5 lg:h-5 lg:w-5' />
      </Button>

      {children}
    </HeroContainer>
  )
}
