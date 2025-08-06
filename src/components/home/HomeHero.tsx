'use client'

import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { ContentPill } from '@/components/shared/ContentPill'
import { SparklesIcon } from '@heroicons/react/16/solid'
import { CLIENTS } from '@/config'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import appScreenshot from '@/images/app-screenshot.png'
import cosmicButterfly from '@/images/cosmic-butterfly.png'

export const HomeHero = () => {
  const { isConnected, connect } = useWallet();
  const router = useRouter();
  
  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else {
      connect();
    }
  };
  return (
    <Container className='gap-16 pt-20 pb-16 sm:pb-20 lg:pt-28'>
      {/* Text content */}
      <div>
        <div className='relative z-10 flex flex-col items-center'>
          <ContentPill
            text='We just shipped version 1.0!'
            Icon={SparklesIcon}
          />
          <h1 className='text-indigo-blue-100 mt-5 max-w-5xl text-center text-[2.75rem] leading-[1.125] font-bold sm:text-5xl sm:leading-[1.125] md:text-6xl md:leading-[1.125] lg:text-[64px]'>
            Get ready for the future of&nbsp;
            <span className='relative inline-block text-nowrap'>
              <span className='from-aqua-500 to-indigo-blue-700 relative z-10 bg-linear-to-b from-8% to-80% bg-clip-text text-transparent'>
                decentralised
              </span>
              <span className='text-aqua-300 absolute -top-px left-0 -z-10'>
                decentralised
              </span>
            </span>
            &nbsp;finance.
          </h1>
          <p className='mt-5 max-w-xl text-center text-[17px] leading-8 text-slate-300 sm:text-lg sm:leading-8'>
            Our multi-faceted approach combines intelligent liquidity provision
            across Balancer v3 pools and strategic staking to deliver consistent returns
            in any market condition.
          </p>
          <div className='mt-8 flex items-center justify-center space-x-3 sm:space-x-5'>
            <Button id='top-cta' onClick={handleGetStarted}>
              {' '}
              {isConnected ? 'Go to Dashboard' : 'Get started'}{' '}
            </Button>
            <Button variant='tertiary' href='https://t.me/+gbjAAlcYhL9kMzZk' target='_blank' rel='noopener noreferrer' className='group overflow-hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                className='size-4 text-violet-100/85 duration-200 ease-in-out group-hover:text-violet-100'
              >
                <title>telegram</title>
                <g fill='currentColor'>
                  <path
                    d='M23.953,2.527a.515.515,0,0,0-.349-.381,1.8,1.8,0,0,0-.945.067S1.63,9.772.429,10.609c-.258.18-.345.285-.388.408-.208.6.439.858.439.858L5.9,13.641a.59.59,0,0,0,.275-.016c1.232-.779,12.4-7.834,13.049-8.071.1-.03.177,0,.157.075-.258.905-9.909,9.478-9.962,9.53a.2.2,0,0,0-.072.177l-.506,5.292s-.212,1.647,1.435,0c1.168-1.169,2.289-2.137,2.849-2.608,1.864,1.287,3.869,2.71,4.734,3.455a1.506,1.506,0,0,0,1.1.423,1.236,1.236,0,0,0,1.051-.933S23.84,5.542,23.968,3.476c.013-.2.03-.332.032-.471A1.762,1.762,0,0,0,23.953,2.527Z'
                    fill='currentColor'
                  />
                </g>
              </svg>
              <span>Join telegram</span>
            </Button>
          </div>
        </div>
      </div>

      {/* App screenshot */}
      <div className='shadow-inner-blur relative mt-16 w-full rounded-2xl bg-white/[.01] p-2 after:absolute after:inset-0 after:rounded-2xl after:border after:border-violet-200/[.04] sm:mt-20 lg:mt-24'>
        <div className='absolute -top-20 -right-20 -bottom-16 -left-20 -rotate-3 sm:-top-32 sm:-right-40 sm:-bottom-24 sm:-left-40 md:-top-40 md:-right-60 md:-bottom-32 md:-left-60 lg:-top-128 lg:-right-80 lg:-left-96'>
          <Image
            src={cosmicButterfly}
            alt=''
            className='size-full object-cover'
            sizes='100vw'
            priority
          />
        </div>

        <Image
          src={appScreenshot}
          alt='App screenshot'
          className='relative h-auto w-full rounded-lg'
          sizes='(max-width: 1280px) 100vw, 1200px'
          priority
        />
      </div>

      {/* Social proof */}
      <div className='relative mx-auto mt-20 max-w-5xl overflow-hidden sm:mt-24 sm:px-10 lg:mt-28'>
        <p className='text-aqua-50/80 text-center text-[13px] font-bold tracking-wide uppercase sm:text-sm sm:font-extrabold sm:tracking-wider'>
          Connect your wallet securely with our platform
        </p>

        {/* Logos */}
        <div className='relative mt-8 overflow-hidden [mask:linear-gradient(90deg,_transparent,_white_20%,_white_80%,_transparent)]'>
          <div className='animate-infiniteScroll flex w-max items-center justify-around'>
            {[...Array(2)].map((_, index) => (
              <div
                key={`homehero-clients-col-${index}`}
                className='flex w-1/2 items-center'
              >
                {CLIENTS.map((client) => (
                  <client.logo
                    key={`homehero-${client.name}-${index}`}
                    className='mx-3 scale-90 sm:mx-6 sm:scale-100'
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
