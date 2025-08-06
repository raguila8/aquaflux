import { DateRangePicker } from '@/components/application/date-picker/date-range-picker'
import { parseDate } from '@internationalized/date'
import { BadgeWithIcon } from '@/components/base/badges/badges'
import { ArrowUp } from '@untitledui/icons'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label as RechartsLabel,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
} from 'recharts'
import { ChartTooltipContent } from '@/components/application/charts/charts-base'
import { cn } from '@/lib/utils'

interface FluxChartProps {
  height?: string
}

const lineData = [
  {
    date: '2025-01-01',
    A: 1200,
    B: 400,
  },
  {
    date: '2025-02-01',
    A: 1300,
    B: 210,
  },
  {
    date: '2025-03-01',
    A: 1160,
    B: 600,
  },
  {
    date: '2025-04-01',
    A: 1300,
    B: 620,
  },
  {
    date: '2025-05-01',
    A: 1480,
    B: 440,
  },
  {
    date: '2025-06-01',
    A: 1300,
    B: 660,
  },
  {
    date: '2025-07-01',
    A: 1240,
    B: 480,
  },
  {
    date: '2025-08-01',
    A: 1500,
    B: 960,
  },
  {
    date: '2025-09-01',
    A: 1560,
    B: 800,
  },
  {
    date: '2025-10-01',
    A: 1300,
    B: 580,
  },
  {
    date: '2025-11-01',
    A: 1500,
    B: 760,
  },
  {
    date: '2025-12-01',
    A: 1609,
    B: 1000,
  },
]

const colors: Record<string, string> = {
  A: 'text-utility-brand-600',
  B: 'text-utility-brand-300/80',
  C: 'text-utility-brand-700',
}

export const FluxChart = ({ height = 'h-64' }: FluxChartProps) => {
  return (
    <div className='ring-secondary lg:shadow-inner-blur flex flex-col gap-6 rounded-xl ring-inset lg:gap-5 lg:bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] lg:p-6 lg:ring-1'>
      <div className='flex flex-col gap-4 lg:gap-2'>
        <div className='flex items-center justify-between gap-4'>
          <p className='text-primary text-lg font-semibold'>
            Token performance over time
          </p>
          <DateRangePicker
            defaultValue={{
              start: parseDate('2025-01-01'),
              end: parseDate(new Date().toISOString().split('T')[0]),
            }}
          />
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-display-sm text-primary font-semibold'>$1609.75</p>
          <BadgeWithIcon type='modern' color='success' iconLeading={ArrowUp}>
            7.2%
          </BadgeWithIcon>
        </div>
      </div>

      <div className={cn('flex flex-col gap-2', height)}>
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
                className: 'fill-bg-primary stroke-utility-brand-600 stroke-2',
              }}
            />

            <Area
              isAnimationActive={false}
              className={cn(
                colors['B'],
                '[&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]'
              )}
              dataKey='B'
              name='2024'
              type='monotone'
              stroke='currentColor'
              strokeWidth={2}
              fill='none'
              strokeDasharray='0.1 8'
              strokeLinecap='round'
              activeDot={{
                className: 'fill-bg-primary stroke-utility-brand-600 stroke-2',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
