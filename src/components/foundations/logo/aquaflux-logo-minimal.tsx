'use client'

import type { SVGProps } from 'react'
import { useId } from 'react'
import { cx } from '@/utils/cx'

export const AquafluxLogoMinimal = (props: SVGProps<SVGSVGElement>) => {
  const id = useId()

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='38'
      height='32'
      viewBox='0 0 38 32'
      fill='none'
      {...props}
      className={cx('h-8 w-auto origin-center', props.className)}
    >
      <path
        d='M35.0267 32C34.2098 32 33.4095 31.5812 32.9575 30.8306L25.0373 17.6359C22.852 13.9909 22.7939 9.60788 24.888 5.90903C26.9821 2.21019 30.768 0 35.0184 0C36.3495 0 37.4276 1.07814 37.4276 2.40923C37.4276 3.74031 36.3495 4.81845 35.0184 4.81845C32.5262 4.81845 30.3077 6.11222 29.0803 8.28094C27.8529 10.4497 27.8861 13.0165 29.1674 15.1561L37.0876 28.3509C37.7718 29.4913 37.4027 30.9716 36.2624 31.6558C35.8767 31.888 35.4496 32 35.0267 32Z'
        fill={`url(#paint0_linear_${id})`}
      />
      <path
        d='M2.4046 32C1.98164 32 1.55453 31.8881 1.16889 31.6558C0.0285516 30.9716 -0.340503 29.4913 0.343701 28.3509L16.6526 1.16938C17.3368 0.0290421 18.8172 -0.340015 19.9575 0.344188C21.0979 1.02839 21.4669 2.50876 20.7827 3.6491L4.4738 30.8306C4.02181 31.5812 3.2215 32 2.4046 32Z'
        fill={`url(#paint1_linear_${id})`}
      />
      <path
        d='M34.8028 14.2646C36.2089 14.2646 37.3488 13.1247 37.3488 11.7186C37.3488 10.3124 36.2089 9.17249 34.8028 9.17249C33.3966 9.17249 32.2567 10.3124 32.2567 11.7186C32.2567 13.1247 33.3966 14.2646 34.8028 14.2646Z'
        fill={`url(#paint2_linear_${id})`}
      />
      <path
        d='M18.9582 22.3922H8.17265C6.84157 22.3922 5.76343 21.314 5.76343 19.9829C5.76343 18.6519 6.84157 17.5737 8.17265 17.5737H18.9582C20.2893 17.5737 21.3674 18.6519 21.3674 19.9829C21.3674 21.314 20.2893 22.3922 18.9582 22.3922Z'
        fill={`url(#paint3_linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`paint0_linear_${id}`}
          x1='20.8681'
          y1='-0.657416'
          x2='40.5618'
          y2='22.5117'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#03C9E6' />
          <stop offset='1' stop-color='#2C4ED6' />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_${id}`}
          x1='6.66583'
          y1='11.4144'
          x2='26.3596'
          y2='34.5836'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#03C9E6' />
          <stop offset='1' stop-color='#2C4ED6' />
        </linearGradient>
        <linearGradient
          id={`paint2_linear_${id}`}
          x1='22.8521'
          y1='-2.3438'
          x2='42.5459'
          y2='20.8253'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#03C9E6' />
          <stop offset='1' stop-color='#2C4ED6' />
        </linearGradient>
        <linearGradient
          id={`paint3_linear_${id}`}
          x1='6.44348'
          y1='11.6035'
          x2='26.1373'
          y2='34.7726'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#03C9E6' />
          <stop offset='1' stop-color='#2C4ED6' />
        </linearGradient>
      </defs>
    </svg>
  )
}
