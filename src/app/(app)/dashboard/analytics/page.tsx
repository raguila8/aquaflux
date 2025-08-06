'use client'

export const dynamic = 'force-dynamic'

import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
} from 'recharts'
import { MetricChangeIndicator } from '@/components/application/metrics/metrics'
import { ChartTooltipContent } from '@/components/application/charts/charts-base'
import { cx } from '@/utils/cx'
import { FluxChart } from '@/components/application/charts/flux-chart'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getWalletTokenBalances } from '@/services/fluxPriceService'
import { getUserBalancerTotalValue, getUserBalancerPositions } from '@/services/balancerV3Service'
import { VAULT_ADDRESS } from '@/config/constants'

export default function Analytics() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 12935.56,
    baseAssets: 3751.31,
    balancerValue: 9184.25,
    balancerPositions: [
      { name: 'USDC/ARB', value: 5143.18 },
      { name: 'ETH/USDC', value: 2204.22 },
      { name: 'USDC/USDT', value: 1836.85 }
    ]
  });
  
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      setTimeout(() => {
        connect();
      }, 100);
    }
  }, [isConnected, router, connect]);

  // Fetch real data
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [tokenBalances, balancerValue, balancerPositions] = await Promise.all([
          getWalletTokenBalances(VAULT_ADDRESS),
          getUserBalancerTotalValue(VAULT_ADDRESS),
          getUserBalancerPositions(VAULT_ADDRESS)
        ]);

        const baseAssetsValue = tokenBalances.reduce((sum, token) => sum + token.valueInUSD, 0);
        const totalValue = baseAssetsValue + balancerValue;

        // Map balancer positions for pie chart
        const mappedPositions = balancerPositions.slice(0, 3).map(pos => ({
          name: pos.poolName.length > 12 ? pos.poolName.substring(0, 12) + '...' : pos.poolName,
          value: pos.totalValueUSD
        }));

        setPortfolioData({
          totalValue,
          baseAssets: baseAssetsValue,
          balancerValue,
          balancerPositions: mappedPositions.length > 0 ? mappedPositions : [
            { name: 'USDC/ETH', value: balancerValue * 0.56 },
            { name: 'ETH/USDC', value: balancerValue * 0.24 },
            { name: 'USDC/USDT', value: balancerValue * 0.20 }
          ]
        });
      } catch (error) {
        console.error('Error fetching real portfolio data:', error);
      }
    };

    if (isConnected) {
      fetchRealData();
    }
  }, [isConnected]);

  const pieChartData1 = [
    {
      name: 'Balancer v3',
      value: portfolioData.balancerValue,
      className: 'text-brand-200 bg-brand-300',
    },
    {
      name: 'Base Assets',
      value: portfolioData.baseAssets,
      className: 'text-brand-500 bg-brand-500',
    }
  ];

  const pieChartData2 = portfolioData.balancerPositions.map((position, index) => ({
    name: position.name,
    value: position.value,
    className: [
      'text-indigo-blue-300 bg-indigo-blue-300',
      'text-indigo-blue-500 bg-indigo-blue-400', 
      'text-indigo-blue-700 bg-indigo-blue-500'
    ][index] || 'text-indigo-blue-300 bg-indigo-blue-300'
  }));

  const PieChartCard = ({
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
  );

  return (
    <div className='flex flex-col gap-10 lg:flex-row'>
      <div className='flex min-w-0 flex-1 flex-col gap-8 lg:gap-5'>
        <FluxChart height='h-80' />

        <div className='flex flex-col gap-x-6 gap-y-5 md:flex-row md:flex-wrap'>
          <PieChartCard
            data={pieChartData1}
            title='Portfolio allocation'
            totalLabel='Total portfolio'
            value={`$${portfolioData.totalValue.toLocaleString()}`}
            change='3.4%'
            className='flex-1 md:min-w-[448px]'
          />
          <PieChartCard
            data={pieChartData2}
            title='Balancer v3 allocation'
            totalLabel='Total Balancer v3 liquidity'
            value={`$${portfolioData.balancerValue.toLocaleString()}`}
            change='2.0%'
            className='flex-1 md:min-w-[448px]'
          />
        </div>
      </div>
    </div>
  )
}