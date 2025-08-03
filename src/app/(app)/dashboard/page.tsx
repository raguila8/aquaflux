'use client'

import { TransactionsTable } from '@/components/application/table/transactions-table'
import { parseDate } from '@internationalized/date'
import {
  BarChartSquare02,
  CheckDone01,
  DownloadCloud02,
  FilterLines,
  HomeLine,
  LayoutAlt01,
  MessageChatCircle,
  PieChart03,
  Plus,
  Settings01,
  Users01,
  ArrowUp,
  Cryptocurrency01,
  Cryptocurrency02,
  Cryptocurrency03,
  Cryptocurrency04,
  SearchLg,
  Edit01,
} from '@untitledui/icons'
import {
  Home03 as Home01,
  Rows01 as Rows03,
  PieChart02 as PieChart02,
  Stars01 as Stars01,
  HelpCircle,
  CreditCardUp,
  Wallet02,
  Cryptocurrency03 as Cryptocurrency03Pro,
} from '@untitledui-pro/icons/solid'
import Home02 from '@/icons/untitledui/duo-tone/home-02.svg'
import Home03 from '@/icons/untitledui/duo-tone/home-03.svg'
import Rows01 from '@/icons/untitledui/duo-tone/rows-01.svg'
import Rows02 from '@/icons/untitledui/duo-tone/rows-02.svg'
import PieChart01 from '@/icons/untitledui/duo-tone/pie-chart-01.svg'
import Home from '@/icons/nucleo/home-colored.svg'
import Transactions from '@/icons/nucleo/transactions-colored.svg'
import PieChart from '@/icons/nucleo/pie-chart-colored.svg'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label as RechartsLabel,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
} from 'recharts'

import { SidebarNavigationSimple } from '@/components/application/app-navigation/sidebar-navigation/sidebar-simple'
import { SidebarNavigationSectionDividers } from '@/components/application/app-navigation/sidebar-navigation/sidebar-section-dividers'
import { FeaturedCardQRCode } from '@/components/application/app-navigation/base-components/featured-cards'
import { ChartTooltipContent } from '@/components/application/charts/charts-base'
import { ContentDivider } from '@/components/application/content-divider/content-divider'
import { DateRangePicker } from '@/components/application/date-picker/date-range-picker'
import { MetricsSimple } from '@/components/application/metrics/metrics'
import {
  BadgeWithDot,
  BadgeWithIcon,
  Badge,
} from '@/components/base/badges/badges'
import { Button } from '@/components/base/buttons/button'
import { useBreakpoint } from '@/hooks/use-breakpoint'

const lineData = [
  {
    date: '2025-01-01',
    A: 600,
    B: 350,
  },
  {
    date: '2025-02-01',
    A: 620,
    B: 370,
  },
  {
    date: '2025-03-01',
    A: 630,
    B: 380,
  },
  {
    date: '2025-04-01',
    A: 650,
    B: 400,
  },
  {
    date: '2025-05-01',
    A: 600,
    B: 350,
  },
  {
    date: '2025-06-01',
    A: 650,
    B: 400,
  },
  {
    date: '2025-07-01',
    A: 620,
    B: 370,
  },
  {
    date: '2025-08-01',
    A: 750,
    B: 500,
  },
  {
    date: '2025-09-01',
    A: 780,
    B: 530,
  },
  {
    date: '2025-10-01',
    A: 750,
    B: 500,
  },
  {
    date: '2025-11-01',
    A: 780,
    B: 530,
  },
  {
    date: '2025-12-01',
    A: 820,
    B: 570,
  },
]

const getBadgeColor = (category: string) => {
  switch (category) {
    case 'Subscriptions':
      return 'blue'
    case 'Food and dining':
      return 'pink'
    case 'Income':
      return 'success'
    case 'Groceries':
      return 'indigo'
    default:
      return 'gray'
  }
}

const colors: Record<string, string> = {
  A: 'text-utility-brand-500',
  B: 'text-utility-gray-200',
}

export default function Dashboard() {
  const isDesktop = useBreakpoint('lg')

  return (
    <div className='bg-primary flex flex-col lg:flex-row'>
      <SidebarNavigationSimple
        hideBorder
        showSearch={false}
        activeUrl='/dashboard'
        items={[
          {
            label: 'Home',
            href: '/dashboard',
            icon: Home01,
          },
          {
            label: 'Transactions',
            href: '/dashboard/transactions',
            icon: Rows03,
          },

          {
            label: 'Flux Analytics',
            href: '/dashboard/analytics',
            icon: PieChart02,
          },
        ]}
        footerItems={[
          {
            label: 'Changelog',
            href: '/changelog',
            icon: Stars01,
            badge: (
              <Badge size='sm' type='modern'>
                Coming soon
              </Badge>
            ),
          },
          {
            label: 'Support',
            href: '/support',
            icon: HelpCircle,
          },
        ]}
        featureCard={
          <FeaturedCardQRCode
            title='Deposit to wallet'
            description='Open your wallet and scan the QR code below to deposit USDC on Arbitrum.'
            confirmLabel='Fund wallet'
            onConfirm={() => {}}
            onDismiss={() => {}}
            showCloseButton={false}
          />
        }
      />
      <main className='min-w-0 flex-1 lg:pt-2'>
        <div className='border-secondary bg-secondary_subtle/60 flex h-full min-h-[calc(100vh_-_8px)] flex-col gap-8 px-6 pt-8 pb-12 shadow-xs lg:rounded-tl-[32px] lg:border-t lg:border-l lg:px-8 lg:pt-10'>
          <div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-8'>
            <div className='flex flex-col gap-5'>
              {/* Page header */}
              <div className='flex flex-col justify-between gap-4 lg:flex-row'>
                <div className='flex flex-col gap-0.5 lg:gap-1'>
                  <p className='text-primary lg:text-display-xs text-xl font-semibold'>
                    Aquaflux Dashboard
                  </p>
                  <p className='text-md text-tertiary'>
                    Lorem ipsum dolor sit amet vestibulum augue.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <Button
                    size='md'
                    color='secondary'
                    iconLeading={CreditCardUp}
                  >
                    Withdraw
                  </Button>
                  <Button size='md' iconLeading={Cryptocurrency03Pro}>
                    Deposit
                  </Button>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-10 lg:flex-row'>
              <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
                <div className='flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5'>
                  <MetricsSimple
                    title='12'
                    subtitle='Flux tokens'
                    type='modern'
                    trend='positive'
                    change='10%'
                    className='flex-1 lg:min-w-[320px]'
                    actions={false}
                  />
                  <MetricsSimple
                    title='$1,280'
                    subtitle='Current token price'
                    type='modern'
                    trend='positive'
                    change='12%'
                    className='flex-1 lg:min-w-[320px]'
                    actions={false}
                  />
                  <MetricsSimple
                    title='$10,911.42'
                    subtitle='Total portfolio value'
                    type='modern'
                    trend='negative'
                    change='2%'
                    className='flex-1 lg:min-w-[320px]'
                    actions={false}
                  />
                </div>

                <div className='ring-secondary lg:shadow-inner-blur flex flex-col gap-6 rounded-xl ring-inset lg:gap-5 lg:bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] lg:p-6 lg:ring-1'>
                  <div className='flex flex-col gap-4 lg:gap-2'>
                    <div className='flex items-center justify-between gap-4'>
                      <p className='text-primary text-lg font-semibold'>
                        Total balance
                      </p>
                      <DateRangePicker
                        defaultValue={{
                          start: parseDate('2025-01-10'),
                          end: parseDate('2025-01-16'),
                        }}
                      />
                    </div>
                    <div className='flex items-center gap-4'>
                      <p className='text-display-sm text-primary font-semibold'>
                        $107,843.82
                      </p>
                      <BadgeWithIcon
                        type='modern'
                        color='success'
                        iconLeading={ArrowUp}
                      >
                        7.2%
                      </BadgeWithIcon>
                    </div>
                  </div>

                  <div className='flex h-50 flex-col gap-2'>
                    <ResponsiveContainer className='h-full'>
                      <AreaChart
                        data={lineData}
                        className='text-tertiary [&_.recharts-text]:text-xs'
                        margin={{
                          left: 5,
                          right: 5,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id='gradient'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='currentColor'
                              className='text-utility-brand-700'
                              stopOpacity='0.7'
                            />
                            <stop
                              offset='95%'
                              stopColor='currentColor'
                              className='text-utility-brand-700'
                              stopOpacity='0'
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          vertical={false}
                          stroke='currentColor'
                          className='text-utility-gray-100'
                        />

                        <XAxis
                          fill='currentColor'
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          interval='preserveStartEnd'
                          dataKey='date'
                          tickFormatter={(value) =>
                            new Date(value).toLocaleString(undefined, {
                              month: 'short',
                            })
                          }
                        >
                          <RechartsLabel
                            value='Month'
                            fill='currentColor'
                            className='text-xs font-medium'
                            position='bottom'
                          />
                        </XAxis>

                        <RechartsTooltip
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleString(undefined, {
                              month: 'short',
                              year: 'numeric',
                            })
                          }
                          cursor={{
                            className: 'stroke-utility-brand-600 stroke-2',
                          }}
                        />

                        <Area
                          isAnimationActive={false}
                          className='text-utility-brand-600 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]'
                          dataKey='A'
                          name='Current period'
                          type='monotone'
                          stroke='currentColor'
                          strokeWidth={2}
                          fill='url(#gradient)'
                          fillOpacity={0.1}
                          activeDot={{
                            className:
                              'fill-bg-primary stroke-utility-brand-600 stroke-2',
                          }}
                        />

                        <Area
                          isAnimationActive={false}
                          className='text-utility-brand-400 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]'
                          dataKey='B'
                          name='Previous period'
                          type='monotone'
                          stroke='currentColor'
                          strokeWidth={2}
                          fill='none'
                          activeDot={{
                            className:
                              'fill-bg-primary stroke-utility-brand-600 stroke-2',
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent transactions */}
                <TransactionsTable />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
