import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { ContentPill } from '@/components/shared/ContentPill'
import { StarField } from '@/components/shared/StarField'
import { cn } from '@/lib/utils'
import type { FC, SVGProps } from 'react'

import spaceSpotlight from '@/images/space-spotlight.png'
import longGradient from '@/images/long-gradient.png'
import CheckIcon from '@/icons/nucleo/o-check-16.svg'
import TeamIcon from '@/icons/nucleo/team-16.svg'
import RoadmapIcon from '@/icons/nucleo/roadmap-16.svg'
import PadlockUnlockedIcon from '@/icons/nucleo/padlock-unlocked-16.svg'
import AlgorithmIcon from '@/icons/nucleo/algorithm-16.svg'

type Plan = 'starter' | 'pro' | 'enterprise'

type FeaturePlans = {
  [key in Plan]: boolean | string | number
}

type Feature = {
  name: string
  plans: FeaturePlans
}

type Category = {
  category: string
  icon: FC<SVGProps<SVGSVGElement>>
  features: Feature[]
}

const pricingTableData: Category[] = [
  {
    category: 'Collaboration & Communication',
    icon: TeamIcon,
    features: [
      {
        name: 'Video Conferencing',
        plans: {
          starter: 'Up to 10 hrs/month',
          pro: 'Unlimited',
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'Team Workspace',
        plans: {
          starter: 'Up to 5',
          pro: 'Unlimited',
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'File Storage',
        plans: {
          starter: '5 GB',
          pro: '50 GB',
          enterprise: '1 TB',
        },
      },
      {
        name: 'Collaboration History',
        plans: {
          starter: '30 days',
          pro: '1 year',
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'Instant Messaging',
        plans: {
          starter: true,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Guest Access',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
    ],
  },
  {
    category: 'Project Management & Workflow',
    icon: RoadmapIcon,
    features: [
      {
        name: 'Custom Workflow Templates',
        plans: {
          starter: false,
          pro: 'Up to 10',
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'Reporting and Analytics',
        plans: {
          starter: 'Basic',
          pro: 'Advanced',
          enterprise: 'Customizable',
        },
      },
      {
        name: 'Task Assignment',
        plans: {
          starter: true,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Gantt Charts',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Time Tracking',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Automated Workflow Triggers',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
    ],
  },
  {
    category: 'Security & Compliance',
    icon: PadlockUnlockedIcon,
    features: [
      {
        name: 'Audit Logs',
        plans: {
          starter: false,
          pro: '6 months',
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'Data Encryption',
        plans: {
          starter: true,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Two-Factor Authentication (2FA)',
        plans: {
          starter: true,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Compliance Reporting',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Role-Based Access Control',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'API Security',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
    ],
  },
  {
    category: 'Integration & Extensibility',
    icon: AlgorithmIcon,
    features: [
      {
        name: 'API Access',
        plans: {
          starter: 'Limited',
          pro: 'Full access',
          enterprise: 'Full access',
        },
      },
      {
        name: 'Marketplace Access',
        plans: {
          starter: 'Basic',
          pro: 'Full access',
          enterprise: 'Full access',
        },
      },
      {
        name: 'Third-Party App Integrations',
        plans: {
          starter: 3,
          pro: 10,
          enterprise: 'Unlimited',
        },
      },
      {
        name: 'Webhooks',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'SDK Access',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
      {
        name: 'Custom Integrations',
        plans: {
          starter: false,
          pro: true,
          enterprise: true,
        },
      },
    ],
  },
]
const planLabels: Plan[] = ['starter', 'pro', 'enterprise']

export function PricingTable() {
  return (
    <section className='relative overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.95),rgba(24,24,27,0.95)),linear-gradient(#2E1065,#2E1065)] pb-16 pt-20 sm:py-24 lg:py-28'>
      <div className='absolute left-0 top-0 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain'
          sizes='(max-width: 1024px) 100vw, 1280px'
        />
      </div>

      {/* Stars */}
      <div className='absolute left-0 top-0 z-0 h-72 w-72' aria-hidden='true'>
        <StarField density='high' maxRadius={2.5} minRadius={1.25} />
      </div>

      <div className='absolute -top-96 bottom-48 left-0 right-80 z-0'>
        <Image
          src={longGradient}
          alt=''
          className='h-full w-full object-contain object-center opacity-50'
          sizes='(max-width: 768px) 100vw, 1024px'
        />
      </div>

      <div className='absolute -bottom-96 -right-2/3 left-0 top-1/2 z-0'>
        <Image
          src={longGradient}
          alt=''
          className='h-full w-full object-contain object-center opacity-40'
          sizes='(max-width: 768px) 100vw, 1024px'
        />
      </div>
      <Container>
        {/* Heading */}
        <div className='relative flex flex-col items-center'>
          <h1 className='max-w-4xl text-center text-4xl font-bold leading-extratight text-violet-100 sm:text-5xl sm:leading-extratight'>
            Compare all plan details
          </h1>
        </div>

        {/* Tables */}
        <div className='-mx-5 -my-2 mt-12 overflow-x-auto sm:-mx-6 sm:mt-16 lg:-mx-8'>
          <div className='inline-block min-w-full px-5 py-2 align-middle sm:px-6 lg:px-8'>
            <div className='min-w-full space-y-12'>
              {pricingTableData.map((category) => (
                <table
                  key={`pricing-table-${category.category}`}
                  className='min-w-full'
                >
                  <thead>
                    <tr className='border-b border-violet-200/10'>
                      <th
                        scope='col'
                        className='text-left text-sm font-semibold text-white sm:pl-2'
                      >
                        <ContentPill
                          text={category.category}
                          Icon={category.icon}
                          iconClassName='w-3.5 h-3.5'
                        />
                      </th>
                      {planLabels.map((planLabel) => (
                        <th
                          key={`pricing-table-${category.category}-label-${planLabel}`}
                          scope='col'
                          className={cn(
                            'flex-1 text-nowrap px-3 py-6 text-center text-sm font-semibold',
                            planLabel === 'pro'
                              ? 'text-violet-400'
                              : 'text-zinc-300'
                          )}
                        >
                          {planLabel.charAt(0).toUpperCase() +
                            planLabel.slice(1)}{' '}
                          plan
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, rowIndex) => (
                      <tr
                        key={`pricing-table-${category.category}-feature-${rowIndex}`}
                        className='w-full border-b border-violet-200/[0.06]'
                      >
                        <td className='whitespace-nowrap py-5 pl-6 text-left text-sm font-medium text-white sm:py-6 sm:pl-8'>
                          {feature.name}
                        </td>
                        {planLabels.map((plan, planIndex) => (
                          <td
                            key={`pricing-table-${category.category}-feature-${rowIndex}-plan-${planIndex}`}
                            className={cn(
                              'relative flex-1 justify-center whitespace-nowrap px-4 py-5 text-center text-sm leading-4 text-zinc-200 before:absolute before:inset-y-0 before:left-0 before:h-full before:w-px before:bg-linear-to-b after:absolute after:left-[0.5px] after:top-1/2 after:h-3.5 after:w-px after:-translate-y-1/2 after:translate-x-[-0.5px] after:bg-linear-to-b after:from-violet-200/10 after:via-violet-300/20 after:to-violet-200/10 sm:py-6',
                              (3 * rowIndex + planIndex) % 2
                                ? 'before:from-violet-200/[0.025] before:to-violet-200/[0.08]'
                                : 'before:from-violet-200/[0.08] before:to-violet-200/[0.025]'
                            )}
                          >
                            {typeof feature.plans[plan] === 'boolean'
                              ? feature.plans[plan] && (
                                  <CheckIcon
                                    className={cn(
                                      'mx-auto h-3 w-3 shrink-0',
                                      plan === 'pro'
                                        ? 'text-violet-400'
                                        : 'text-violet-100'
                                    )}
                                  />
                                )
                              : feature.plans[plan]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
