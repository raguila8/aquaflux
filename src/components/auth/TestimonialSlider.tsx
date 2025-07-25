'use client'

import Image from 'next/image'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'
import { useRef, useState } from 'react'
import '@splidejs/splide/css'

import fictionalLogo01 from '@/images/logos/fictional-logo-01.svg'
import fictionalLogo02 from '@/images/logos/fictional-logo-02.svg'
import fictionalLogo03 from '@/images/logos/fictional-logo-03.svg'
import avatar1 from '@/images/avatars/avatar-1.png'
import avatar2 from '@/images/avatars/avatar-2.png'
import avatar3 from '@/images/avatars/avatar-3.png'

const testimonials = [
  {
    company: 'Fictional logo 1',
    logo: fictionalLogo01,
    avatar: avatar1,
    name: 'Ethan Long',
    title: 'Lead Marketer, Layers',
    quote:
      'So happy our team moved to Nebula! It Simplified our hiring process, making collaboration a breeze.',
  },
  {
    company: 'Fictional logo 02',
    logo: fictionalLogo02,
    avatar: avatar2,
    name: 'Amélie Laurent',
    title: 'Product Manager, Sisyphus',
    quote:
      'We’ve been using Nebula to kick start every new project and can’t imagine working without it.',
  },
  {
    company: 'Fictional logo 03',
    logo: fictionalLogo03,
    avatar: avatar3,
    name: 'Olivia Simmons',
    title: 'CTO, Capsule',
    quote:
      'Nebula’s collaboration software streamlined our dev process with seamless integrations.',
  },
]

export function TestimonialSlider() {
  const splideRef = useRef<Splide>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleFeatureClick = (index: number) => {
    setActiveIndex(index)
    splideRef.current?.go(index)
  }

  return (
    <Splide
      className='mt-16 flex flex-col justify-center lg:mt-0'
      ref={splideRef}
      options={{
        type: 'loop',
        speed: 700,
        pagination: false,
        arrows: false,
        perPage: 1,
        perMove: 1,
        autoplay: true,
        interval: 10000,
      }}
      onMove={(_: any, newIndex: number) => setActiveIndex(newIndex)}
      aria-label='Testimonials slider'
      hasTrack={false}
    >
      <SplideTrack>
        {testimonials.map((testimonial, index) => (
          <SplideSlide key={`testimonial-slider-${index}`}>
            <div className='relative z-10 flex flex-col items-center'>
              <testimonial.logo className='h-10 w-auto' />
              <p className='mt-7 max-w-sm text-center text-lg font-medium leading-8 text-violet-50 sm:mt-8 sm:text-xl'>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className='mt-8 flex flex-col items-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(to_top_right,rgba(113,113,122,0.3),rgba(24,24,27,1)),linear-gradient(rgba(9,9,11,0.5),rgba(9,9,11,0.5))]'>
                  <Image
                    className='h-[62px] w-[62px] rounded-full object-cover'
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                </div>
                <p className='mt-4 font-semibold text-violet-50 sm:text-lg'>
                  {testimonial.name}
                </p>
                <p className='mt-1 text-sm text-violet-100/80 sm:text-base'>
                  {testimonial.title}
                </p>
              </div>
            </div>
          </SplideSlide>
        ))}
      </SplideTrack>

      <div className='mt-10 flex w-full items-center justify-center space-x-3.5 *:data-[active=false]:bg-violet-300/40 *:data-[active=true]:bg-violet-100 *:hover:data-[active=false]:bg-violet-200/40'>
        {testimonials.map((_, index) => (
          <button
            key={`testimonial-pagination-${index}`}
            data-active={index === activeIndex}
            className='h-2 w-2 rounded-full duration-200 ease-in-out'
            onClick={() => handleFeatureClick(index)}
          />
        ))}
      </div>

      <p className='mx-auto mt-12 max-w-sm text-center text-base font-medium leading-7 text-violet-50/95 sm:mt-14 sm:text-[17px] xl:max-w-md'>
        <span className='bg-linear-to-r from-purple-300 to-violet-400 bg-clip-text font-semibold text-transparent'>
          10,000+
        </span>{' '}
        remote workers are using Nebula to streamline their projects and enhance
        collaboration.
      </p>
    </Splide>
  )
}
