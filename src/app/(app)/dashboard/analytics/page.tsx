'use client'

import { parseDate } from '@internationalized/date'
import { ArrowUp } from '@untitledui/icons'
import { CreditCardUp, Cryptocurrency03 } from '@untitledui-pro/icons/solid'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Label as RechartsLabel,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  Pie,
  PieChart,
  Legend,
} from 'recharts'
import { TableRowActionsDropdown } from '@/components/application/table/table'
import { MetricChangeIndicator } from '@/components/application/metrics/metrics'
import {
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/application/charts/charts-base'
import { DateRangePicker } from '@/components/application/date-picker/date-range-picker'
import { BadgeWithIcon } from '@/components/base/badges/badges'
import { Button } from '@/components/base/buttons/button'
import { cx } from '@/utils/cx'

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

const pieChartData1 = [
  {
    name: 'Uniswap v3',
    value: 9184.25,
    className: 'text-brand-200 bg-brand-300',
  },
  {
    name: 'USDC',
    value: 2587.11,
    className: 'text-brand-500 bg-brand-500',
  },
  {
    name: 'ETH (Arbitrum)',
    value: 1034.84,
    className: 'text-brand-700 bg-brand-600',
  },
  {
    name: 'GRT',
    value: 129.36,
    className: 'text-brand-900 bg-brand-800',
  },
]

const pieChartData2 = [
  {
    name: 'USDC/ARB',
    value: 5143.18,
    className: 'text-indigo-blue-300 bg-indigo-blue-300',
  },
  {
    name: 'ETH/USDC',
    value: 2204.22,
    className: 'text-indigo-blue-500 bg-indigo-blue-400',
  },
  {
    name: 'USDC/USDT',
    value: 1836.85,
    className: 'text-indigo-blue-700 bg-indigo-blue-500',
  },
]

const AccountCard = ({
  data,
  title,
  totalLabel,
  value,
  change,
  className,
}: {
  data: Array<{ name: string; value: number; className: string }>
  title: string
  totalLabel: string
  value: string
  change: string
  className?: string
}) => (
  <div
    className={cx(
      'shadow-inner-blur ring-secondary relative rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset',
      className
    )}
  >
    <div className='flex flex-col flex-wrap gap-6 p-5 lg:p-6'>
      <div className='flex flex-col flex-wrap gap-x-6 gap-y-6 min-[500px]:flex-row min-[500px]:items-center'>
        <div className='size-30'>
          <ResponsiveContainer>
            <PieChart>
              <RechartsTooltip
                content={<ChartTooltipContent isPieChart />}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Pie
                isAnimationActive={false}
                startAngle={-270}
                endAngle={-630}
                stroke='none'
                data={data}
                dataKey='value'
                nameKey='name'
                fill='currentColor'
                innerRadius={35}
                outerRadius={60}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex w-full flex-1 flex-col gap-6 min-[500px]:w-auto'>
          <p className='text-md text-primary hidden font-semibold lg:block'>
            {title}
          </p>
          <div className='flex flex-col gap-2'>
            <p className='text-tertiary text-sm font-medium'>{totalLabel}</p>
            <div className='flex items-end justify-between gap-4'>
              <p className='text-display-sm text-primary font-semibold'>
                {value}
              </p>
              <MetricChangeIndicator
                trend='positive'
                type='trend'
                value={change}
                className='mb-0.5'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full px-0.5'>
        <hr className='h-px border-none bg-linear-to-r from-transparent via-violet-200/15 to-transparent' />
      </div>
      <dl className='flex w-full flex-wrap items-center gap-6 min-[500px]:px-4 sm:gap-x-7'>
        {data.map((item) => (
          <div className='flex gap-2' key={item.name}>
            <span
              className={cx('mt-1 size-2 rounded-full', item.className)}
            ></span>
            <div className='flex flex-col gap-1'>
              <dt className='text-tertiary text-[13px] font-medium'>
                {item.name}
              </dt>
              <dd className='text-primary text-[15px] font-semibold'>
                ${item.value.toLocaleString()}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  </div>
)

export default function Analytics() {
  return (
    <>
      <div className='flex flex-col gap-5'>
        {/* Page header */}
        <div className='flex flex-col justify-between gap-4 lg:flex-row'>
          <div className='flex flex-col gap-0.5 lg:gap-1'>
            <p className='text-primary lg:text-display-xs text-xl font-semibold'>
              Aquaflux Analytics
            </p>
            <p className='text-md text-tertiary'>
              Lorem ipsum dolor sit amet vestibulum augue.
            </p>
          </div>
          <div className='flex gap-3'>
            <Button size='md' color='secondary' iconLeading={CreditCardUp}>
              Withdraw
            </Button>
            <Button size='md' iconLeading={Cryptocurrency03}>
              Deposit
            </Button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-10 lg:flex-row'>
        <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
          <div className='ring-secondary lg:shadow-inner-blur flex flex-col gap-6 rounded-xl ring-inset lg:gap-5 lg:bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] lg:p-6 lg:ring-1'>
            <div className='flex flex-col gap-4 lg:gap-2'>
              <div className='flex items-center justify-between gap-4'>
                <p className='text-primary text-lg font-semibold'>
                  Token performance over time
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
                  $1609.75
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

            <div className='flex h-80 flex-col gap-2'>
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
                    <linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
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

          <div className='flex flex-col gap-x-6 gap-y-5 md:flex-row md:flex-wrap'>
            <AccountCard
              data={pieChartData1}
              title='Portfolio allocation'
              totalLabel='Total portfolio'
              value='$12,935.56'
              change='3.4%'
              className='flex-1 md:min-w-[448px]'
            />
            <AccountCard
              data={pieChartData2}
              title='Uniswap v3 allocation'
              totalLabel='Total Uniswap v3 liquidity'
              value='$9,184.25'
              change='2.0%'
              className='flex-1 md:min-w-[448px]'
            />
          </div>
        </div>
      </div>
    </>
  )
}
