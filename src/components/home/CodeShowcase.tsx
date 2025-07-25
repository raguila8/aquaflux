'use client'

import Image from 'next/image'
import { Code } from '@/components/shared/Code'
import { ContentPill } from '@/components/shared/ContentPill'
import { useRef, useState } from 'react'
import { PresentationChartLineIcon } from '@heroicons/react/16/solid'
import {
  ClockIcon,
  RectangleStackIcon,
  ComputerDesktopIcon,
  SquaresPlusIcon,
} from '@heroicons/react/20/solid'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import clsx from 'clsx'
import cosmicButterfly from '@/images/cosmic-butterfly-2.svg?url'

type Icon = React.FC<Parameters<typeof PresentationChartLineIcon>[0]>

type Feature = {
  title: string
  description: string
  icon: string
  codeBlocks: string[]
}

type Props = {
  features: Feature[]
}

export const CodeShowcase = ({ features }: Props) => {
  const splideRef = useRef<Splide>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleFeatureClick = (index: number) => {
    setActiveIndex(index)
    splideRef.current?.go(index)
  }

  const iconMap: { [key: string]: Icon } = {
    ClockIcon,
    RectangleStackIcon,
    ComputerDesktopIcon,
    SquaresPlusIcon,
  }

  function Icon({ icon, className }: { icon: string; className: string }) {
    const Icon = iconMap[icon]
    return <Icon className={className} />
  }

  const setTrackHeight = () => {
    requestAnimationFrame(() => {
      const activeSlide = document.querySelector(
        '.splide__slide.is-active'
      ) as HTMLLIElement
      const splideTrack = document.querySelector(
        '.splide__track'
      ) as HTMLDivElement
      if (activeSlide && splideTrack) {
        splideTrack.style.height = `${activeSlide.clientHeight}px`
      }
    })
  }

  return (
    <div className='mx-auto max-w-lg px-5 sm:max-w-3xl sm:px-6 lg:ml-auto lg:mr-0 lg:grid lg:max-w-(--breakpoint-2xl) lg:grid-cols-10 lg:px-8 xl:grid-cols-11 2xl:max-w-[calc(100vw_-_((100vw_-_1280px)_/_2))]'>
      <div className='flex items-center lg:col-span-6 xl:col-span-6'>
        <div className='relative z-10 flex flex-col'>
          <ContentPill
            Icon={PresentationChartLineIcon}
            text='Productivity enhancing tools'
          />
          <h1 className='mt-5 text-4xl font-bold leading-extratight text-violet-100 xl:text-[2.75rem] xl:leading-extratight'>
            Foundational building blocks for seamless collaboration
          </h1>

          {/*  Text content */}
          <div className='mt-6'>
            <p className='text-lg leading-8 text-zinc-300 lg:text-[17px] xl:text-lg xl:leading-8'>
              That robust shop as rich siphon in organic french so acerbic
              plunger. Au foam strong irish press go body and sugar kopi
              viennese percolator beans coffee.
            </p>
            <p className='mt-8 text-lg leading-8 text-zinc-300 lg:text-[17px] lg:leading-8 xl:text-lg xl:leading-8'>
              Doppio sugar seasonal in café sugar ut at robust eu percolator
              shop. Kopi est espresso bar to carajillo trifecta robust sit foam
              viennese aromatic variety. Trade panna robust robust trade chicory
              con acerbic that skinny. Latte acerbic a brewed acerbic arabica
              body and iced plunger saucer wings crema.
            </p>
          </div>

          {/* Features */}
          <div className='mt-12 grid gap-2.5 sm:grid-cols-2 sm:gap-5 lg:gap-4 xl:gap-5'>
            {features.map((feature, index) => (
              <div
                key={`feature-${feature.title}`}
                className={clsx(
                  'feature cursor-pointer rounded-2xl duration-200',
                  activeIndex === index && 'active'
                )}
                onClick={() => handleFeatureClick(index)}
              >
                <div className='h-full w-full rounded-2xl border p-6 lg:p-5 xl:p-6'>
                  <div className='flex items-center space-x-2'>
                    <Icon
                      icon={feature.icon}
                      className='h-[17px] w-[17px] text-violet-50 lg:h-4 lg:w-4 xl:h-[17px] xl:w-[17px]'
                    />
                    <h3 className='text-[17px] font-semibold text-white lg:text-base xl:text-[17px]'>
                      {feature.title}
                    </h3>
                  </div>
                  <p className='mt-2 text-[17px] leading-7 text-zinc-300 lg:text-base lg:leading-7 xl:text-[17px] xl:leading-7'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='mt-12 lg:col-span-4 lg:pl-10 xl:col-span-5 xl:pl-24'>
        <Splide
          ref={splideRef}
          options={{
            rewind: true,
            speed: 800,
            pagination: false,
            arrows: false,
            drag: false,
            direction: 'ttb',
            autoHeight: true,
            height: '826px',
            perPage: 1,
            gap: '3rem',
            breakpoints: {
              640: {
                perPage: 1,
              },
            },
          }}
          onMounted={setTrackHeight}
          onMoved={setTrackHeight}
          aria-label='Features code blocks'
          hasTrack={false}
        >
          <SplideTrack className='overflow-visible!'>
            {/* for each feature loop through the codeBlocks */}
            {features.map((feature, index) => (
              <SplideSlide
                key={`feature-code-blocks-container-${feature.title}`}
              >
                <div
                  className={clsx(
                    'transition-opacity duration-200 lg:duration-1000',
                    activeIndex !== index && 'opacity-0 lg:opacity-15'
                  )}
                >
                  <div className='flex min-h-[805px] flex-col justify-center space-y-10'>
                    {feature.codeBlocks.map((codeBlock, index) => (
                      <div
                        key={`feature-${feature.title}-codeblock-${index}`}
                        className='relative w-full rounded-2xl border border-violet-200/[.08] bg-white/[.01] p-2 shadow-inner-blur'
                      >
                        <div className='absolute -bottom-20 -left-48 -right-16 -top-40'>
                          <Image
                            src={cosmicButterfly}
                            alt=''
                            className='h-full w-full object-contain'
                          />
                        </div>

                        <div className='relative h-full w-full rounded-lg bg-[#292D3E]/[0.93] shadow-inner-blur backdrop-blur-sm'>
                          <div className='flex h-full flex-col rounded-lg border border-violet-200/[.06]'>
                            <div className='flex items-center space-x-1.5 rounded-tl-lg rounded-tr-lg bg-zinc-700/25 px-4 py-3 shadow-inner-blur-no-border'>
                              <span className='h-2 w-2 rounded-full bg-violet-50/25' />
                              <span className='h-2 w-2 rounded-full bg-violet-50/25' />
                              <span className='h-2 w-2 rounded-full bg-violet-50/25' />
                            </div>
                            <div className='h-full rounded-b-lg border-t border-violet-200/[.06]'>
                              <Code html={codeBlock} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
        </Splide>
      </div>
    </div>
  )
}
