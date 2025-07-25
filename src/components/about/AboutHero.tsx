'use client'

import { Investors } from './Investors'
import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { ChevronDoubleDownIcon } from '@heroicons/react/16/solid'
import { cn, getOffsetTop } from '@/lib/utils'
import { useEffect, useRef } from 'react'

import cosmicButterfly from '@/images/cosmic-butterfly.png'
import company01 from '@/images/company-01.png'
import company02 from '@/images/company-02.png'
import company03 from '@/images/company-03.png'
import company04 from '@/images/company-04.png'
import company05 from '@/images/company-05.png'

const companyImages = [
  {
    image: company01,
    alt: 'Group of coworkers in a meeting, discussing around a table',
  },
  {
    image: company02,
    alt: 'Team collaborating over charts and documents in a meeting room',
  },
  {
    image: company03,
    alt: 'Group of colleagues working together at a shared workspace',
  },
  {
    image: company04,
    alt: 'Two people playing foosball in a modern office',
  },
  {
    image: company05,
    alt: 'Coworkers celebrating a birthday in the office with a sign',
  },
]

const getVerticalOffsetClassName = (index: number) => {
  const classes = [
    '',
    'sm:translate-y-20 lg:translate-y-32',
    'sm:translate-y-10 lg:translate-y-16',
    'sm:-translate-y-5 lg:-translate-y-8',
    'sm:translate-y-5 lg:translate-y-8',
  ]
  return classes[index % classes.length]
}

export function AboutHero() {
  const textHeaderRef = useRef<HTMLDivElement>(null)
  const imagesWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let initialWidth = window.innerWidth

    const handleScroll = () => {
      if (!textHeaderRef.current) return

      const scrollProgress =
        window.scrollY /
        (getOffsetTop(textHeaderRef.current) +
          textHeaderRef.current.offsetHeight)

      const clampedScrollProgress = Math.max(0, Math.min(scrollProgress, 1))
      document.documentElement.style.setProperty(
        '--scroll-progress',
        clampedScrollProgress.toString()
      )
    }

    const initializeImages = () => {
      const images =
        imagesWrapperRef.current?.querySelectorAll<HTMLElement>(
          '.image-container'
        )!
      images.forEach((container) => {
        const initialTranslate = getInitialTranslate(container)
        container.style.setProperty(
          '--initial-translate',
          `${initialTranslate}px`
        )
        container.style.setProperty(
          '--overshoot-translate',
          `${-1 * initialTranslate}px`
        )
      })

      const maxTranslateY = calculateMaxTranslateY(images)
      const maxTranslateX = calculateMaxTranslateX(images)

      document.documentElement.style.setProperty(
        '--max-translate-x',
        `${maxTranslateX * -1}px`
      )
      document.documentElement.style.setProperty(
        '--max-translate-y',
        `${maxTranslateY}px`
      )
    }

    const getInitialTranslate = (container: HTMLElement): number => {
      const style = window.getComputedStyle(container)
      const translateY = style.getPropertyValue('--tw-translate-y').trim()

      if (translateY) {
        // Handle calc() expressions like "calc(0.25rem * 8)"
        if (translateY.startsWith('calc(') && translateY.endsWith(')')) {
          const inner = translateY.slice(5, -1).trim() // remove "calc(" and ")"
          if (inner.includes('*')) {
            const parts = inner.split('*')
            const valuePart = parts[0].trim()
            const multiplier = parseFloat(parts[1].trim())
            if (valuePart.endsWith('rem')) {
              const remValue = parseFloat(valuePart)
              return remValue * 16 * multiplier
            } else if (valuePart.endsWith('px')) {
              const pxValue = parseFloat(valuePart)
              return pxValue * multiplier
            }
          }
          return 0
        }
        // Existing logic for rem and px values
        if (translateY.endsWith('rem')) {
          const remValue = parseFloat(translateY)
          return remValue * 16 // Assuming 1rem = 16px
        }
        if (translateY.endsWith('px')) {
          return parseFloat(translateY)
        }
      }
      return 0
    }

    const calculateMaxTranslateY = (
      images: NodeListOf<HTMLElement>
    ): number => {
      return Math.max(
        ...Array.from(images).map((imageContainer) =>
          getInitialTranslate(imageContainer)
        )
      )
    }

    const calculateMaxTranslateX = (
      images: NodeListOf<HTMLElement>
    ): number => {
      const imagesWrapper = imagesWrapperRef.current
      if (!imagesWrapper) return 0

      const imagesWrapperRect = imagesWrapper.getBoundingClientRect()
      const totalWidth =
        Array.from(images).reduce((acc, container) => {
          return acc + container.getBoundingClientRect().width
        }, 0) +
        (images.length - 1) * parseFloat(getComputedStyle(imagesWrapper).gap)

      const viewportWidth = window.innerWidth
      return (totalWidth - viewportWidth) / 2 + imagesWrapperRect.x
    }

    const handleResize = () => {
      const currentWidth = window.innerWidth
      if (currentWidth !== initialWidth) {
        initializeImages()
        initialWidth = currentWidth // Update initialWidth to the new width
      }
    }

    const initializeComponent = () => {
      if (!imagesWrapperRef.current) return

      document.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
      initializeImages()
    }

    // Cleanup event listeners
    const cleanupComponent = () => {
      document.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }

    initializeComponent()
    return cleanupComponent
  }, [])

  return (
    <Container className='pt-20 pb-16 sm:pb-20 lg:pt-28'>
      <div className='relative z-10 mx-auto max-w-lg sm:max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-12 lg:items-start lg:gap-x-8 xl:grid-cols-2 xl:gap-x-12 2xl:gap-x-20'>
        {/* Heading */}
        <div ref={textHeaderRef} className='lg:col-span-7 xl:col-span-1'>
          <h1 className='leading-extratight sm:leading-extratight lg:leading-extratight relative z-10 text-4xl font-bold text-violet-100 sm:text-[2.75rem] lg:text-5xl'>
            Our goal is to empower people to excel in the era of remote work
          </h1>
        </div>

        {/* Text and button */}
        <div className='mt-5 lg:col-span-5 lg:mt-0 xl:col-span-1'>
          <div className='lg:mt-2 lg:ml-auto lg:max-w-lg'>
            <p className='text-lg leading-8 text-zinc-300'>
              Nebula powers a future of flexibility, security, and connectivity,
              enabling seamless workflows that drive{' '}
              <span className='text-violet-200'>
                productivity, efficiency and growth.
              </span>
            </p>
            <div className='mt-8'>
              <Button href='#about-story' variant='secondary'>
                <span>Learn more</span>
                <ChevronDoubleDownIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div
        ref={imagesWrapperRef}
        className='images-wrapper mt-16 flex gap-5 lg:mt-24'
      >
        {companyImages.map((companyImage, index) => (
          <div
            key={`company-image-${index}`}
            className={cn(
              'image-container shadow-inner-blur relative aspect-9/16 w-60 shrink-0 rounded-2xl border border-violet-200/[.08] bg-white/[.01] p-2 lg:w-64 xl:w-72',
              getVerticalOffsetClassName(index)
            )}
          >
            <div className='absolute -top-40 -right-24 -bottom-24 -left-24'>
              <Image
                src={cosmicButterfly}
                alt=''
                className='h-full w-full -rotate-6 opacity-45'
                sizes='556px'
                priority
              />
            </div>

            <Image
              src={companyImage.image}
              alt={companyImage.alt}
              className='relative h-full w-full rounded-lg object-cover'
              priority
            />
          </div>
        ))}
      </div>

      <Investors className='mt-20 sm:mt-56 lg:mt-72' />
    </Container>
  )
}
