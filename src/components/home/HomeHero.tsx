'use client'

import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { ContentPill } from '@/components/shared/ContentPill'
import { useState } from 'react'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import { SparklesIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { PlayCircleIcon } from '@heroicons/react/20/solid'
import { CLIENTS } from '@/config'

import appScreenshot from '@/images/app-screenshot.png'
import cosmicButterfly from '@/images/cosmic-butterfly.png'

export const HomeHero = () => {
  let [isOpen, setIsOpen] = useState(false)

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
            and advanced machine learning trading to deliver consistent returns
            in any market condition.
          </p>
          <div className='mt-8 flex items-center justify-center space-x-3 sm:space-x-5'>
            <Button id='top-cta' href='/signup'>
              {' '}
              Get started{' '}
            </Button>
            <Button
              variant='tertiary'
              onClick={() => setIsOpen(true)}
              className='overflow-hidden'
            >
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-white/[.07] transition duration-200 ease-in-out group-hover:bg-white/10'>
                <PlayCircleIcon className='h-5 w-5 text-violet-50' />
              </span>
              <span>Watch video</span>
            </Button>
          </div>
        </div>

        {/* Video modal*/}
        <Dialog
          className='fixed inset-0 z-50 h-full w-full overflow-hidden px-4 transition duration-150 ease-linear'
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          {/* Modal overlay */}
          <DialogBackdrop
            transition
            className='fixed inset-0 bg-black/30 backdrop-blur-xs transition duration-300 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in'
          />
          <div className='mx-auto flex min-h-screen w-auto items-center justify-center'>
            <DialogPanel
              transition
              className='shadow-inner-blur relative max-h-full w-full max-w-5xl rounded-2xl bg-white/[.02] p-2 transition duration-300 ease-out after:absolute after:inset-0 after:rounded-2xl after:border after:border-violet-200/[.04] data-closed:translate-y-40 data-closed:scale-75 data-closed:opacity-0'
            >
              <Button
                variant='secondary'
                size='md'
                className='absolute -top-12 right-2 z-50 flex p-2 lg:-top-14 lg:p-2.5'
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon className='h-4.5 w-4.5' />
              </Button>
              <div className='relative z-50 aspect-16/9 rounded-lg'>
                <iframe
                  className='absolute h-full w-full rounded-lg'
                  allow='autoplay'
                  title='Video'
                  src='https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
                ></iframe>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
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
