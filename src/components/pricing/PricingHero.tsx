'use client'

import Image from 'next/image'
import { PricingCard } from './PricingCard'
import { InvestorTestimonials } from './InvestorTestimonials'
import { Container } from '@/components/shared/Container'
import { ContentPill } from '@/components/shared/ContentPill'
import { StarField } from '@/components/shared/StarField'
import { useState } from 'react'
import { cn } from '@/lib/utils'

import cosmicButterfly from '@/images/cosmic-butterfly.png'
import TagsStackIcon from '@/icons/nucleo/tags-stack-16.svg'
import CheckIcon from '@/icons/nucleo/o-check-16.svg'

const pricingPlans = [
  {
    title: 'Starter',
    price: {
      monthly: '$9',
      annually: '$7',
    },
    description:
      'Ideal for individual professionals and small teams just beginning their journey looking for a streamlined solution.',
    features: [
      {
        label: '1 GB storage per user',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: 'Basic support',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: 'Access to community forums',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
    ],
    popular: false,
  },
  {
    title: 'Pro',
    price: {
      monthly: '$29',
      annually: '$24',
    },
    description:
      'Designed for growing teams and businesses seeking to enhance their productivity.',
    features: [
      {
        label: '5 GB storage per user',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: 'Priority support',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: 'Private community forums',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
    ],
    popular: true,
  },
  {
    title: 'Enterprise',
    price: {
      monthly: '$69',
      annually: '$59',
    },
    description:
      'Tailored for large organizations requiring a comprehensive solution that evolves with your enterprise.',
    features: [
      {
        label: 'Unlimited storage',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: '24/7 dedicated support',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
      {
        label: 'Exclusive enterprise forums',
        description:
          'Seasonal latte black java dark blue fair grounds barista black origin caffeine.',
      },
    ],
    popular: false,
  },
]

export function PricingHero() {
  const [billingType, setBillingType] = useState<'monthly' | 'annually'>(
    'monthly'
  )

  return (
    <div className='pt-20 pb-12 md:pb-20 lg:py-28'>
      <div className='relative'>
        {/* Stars */}
        <div className='absolute inset-0 -z-10' aria-hidden='true'>
          <StarField />
        </div>

        <Container className='max-w-4xl gap-16 lg:max-w-(--breakpoint-xl)'>
          {/* Text content */}
          <div className='relative z-10 flex flex-col items-center'>
            <ContentPill
              Icon={TagsStackIcon}
              iconClassName='h-3.5 w-3.5'
              text='Nebula’s pricing'
            />
            <h1 className='mt-5 max-w-4xl text-center text-[2.75rem] leading-[1.125] font-bold text-violet-100 sm:text-5xl sm:leading-[1.125] md:text-6xl md:leading-[1.125] lg:text-[64px]'>
              Flexible plans tailored to your needs
            </h1>
            <p className='mt-5 max-w-xl text-center text-[17px] leading-8 text-zinc-200 sm:text-lg sm:leading-8'>
              Discover the perfect plan that aligns with your ambitions and
              scale, and experience the freedom to grow on your terms.
            </p>
          </div>

          {/* Pricing cards */}
          <div className='mx-auto mt-12 flex max-w-lg flex-col items-center sm:mt-16 sm:max-w-xl lg:mx-0 lg:mt-20 lg:max-w-none'>
            {/* Monthly/Annual toggle */}
            <div className='shadow-inner-blur flex items-center rounded-full bg-zinc-950/[.01]'>
              <div className='flex h-full w-full items-center space-x-2 rounded-full border border-violet-200/[.06] px-1 py-1'>
                <button
                  onClick={() => setBillingType('monthly')}
                  className={cn(
                    'group relative inline-flex items-center overflow-hidden rounded-full px-4 py-2 text-sm leading-4 font-semibold antialiased',
                    billingType === 'monthly'
                      ? 'bg-btn-primary shadow-btn-primary text-violet-50'
                      : 'cursor-pointer text-violet-50 hover:text-white'
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingType('annually')}
                  className={cn(
                    'group relative inline-flex items-center overflow-hidden rounded-full px-4 py-2 text-sm leading-4 font-semibold antialiased',
                    billingType === 'annually'
                      ? 'bg-btn-primary shadow-btn-primary text-violet-50'
                      : 'cursor-pointer text-violet-50 hover:text-white'
                  )}
                >
                  Annually
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className='relative'>
              <div className='absolute top-0 -right-96 -bottom-64 -left-96 -z-10'>
                <Image
                  src={cosmicButterfly}
                  alt=''
                  className='h-full w-full object-fill opacity-10'
                  sizes='(max-width: 1024px) 100vw, 1024px'
                />
              </div>
              <div className='mt-10 w-full space-y-10 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0 xl:gap-12'>
                {pricingPlans.map((plan) => (
                  <div
                    key={`pricing-plans-mobile-${plan.title}`}
                    className='flex flex-1 flex-col space-y-8 lg:space-y-0'
                  >
                    {/* Pricing card */}
                    <PricingCard plan={plan} billingType={billingType} />
                    <div className='space-y-8 lg:hidden'>
                      {plan.features.map((feature) => (
                        <div
                          key={`pricing-mobile-${plan.title}-${feature.label}`}
                          className='flex items-start space-x-3'
                        >
                          <CheckIcon
                            className={cn(
                              'mt-1.5 h-4 w-4 shrink-0',
                              plan.popular ? 'text-violet-400' : 'text-white'
                            )}
                          />
                          <p className='text-[17px] leading-7 text-zinc-300'>
                            <span className='mr-0.5 font-semibold text-white'>
                              {feature.label}.
                            </span>
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className='hidden lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-5 xl:gap-12'>
                {pricingPlans.map((plan) => (
                  <div
                    key={`pricing-plans-desktop-${plan.title}`}
                    className='space-y-8'
                  >
                    {plan.features.map((feature) => (
                      <div
                        key={`pricing-desktop-${plan.title}-${feature.label}`}
                        className='flex items-start space-x-3'
                      >
                        <CheckIcon
                          className={cn(
                            'mt-1.5 h-4 w-4 shrink-0',
                            plan.popular ? 'text-violet-400' : 'text-white'
                          )}
                        />
                        <p className='text-[17px] leading-7 text-zinc-300'>
                          <span className='mr-0.5 font-semibold text-white'>
                            {feature.label}.
                          </span>
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <InvestorTestimonials />
    </div>
  )
}
