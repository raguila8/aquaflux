'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { calculateFluxPrice, getFluxTotalSupply } from '@/services/fluxPriceService'
import { getFluxHoldersCount } from '@/services/fluxHoldersService'
import { VAULT_ADDRESS } from '@/config/constants'

const Odometer = dynamic(() => import('react-odometerjs'), { ssr: false })

export const Stats = () => {
  const [stats, setStats] = useState({
    activeWallets: 0,
    currentPrice: 0.37, // Current price
    totalSupply: 0,
    isLoading: true
  })

  const statsRef = useRef(stats)
  statsRef.current = stats

  const statsSectionRef = useRef<HTMLDListElement | null>(null)
  const LAUNCH_PRICE = 0.37 // Launch price in USD

  useEffect(() => {
    const fetchRealStats = async (): Promise<typeof statsRef.current> => {
      try {
        // Get current FLUX price and total supply
        const [priceData, totalSupply] = await Promise.all([
          calculateFluxPrice(VAULT_ADDRESS),
          getFluxTotalSupply()
        ]);
        
        // Get number of wallets holding FLUX tokens
        const activeWallets = await getFluxHoldersCount();
        
        return {
          activeWallets,
          currentPrice: priceData.price,
          totalSupply,
          isLoading: false
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          ...statsRef.current,
          isLoading: false
        };
      }
    }

    const updateStats = () => {
      fetchRealStats().then((data) => {
        setStats(data)
      })
    }

    let interval: NodeJS.Timeout

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateStats()
            interval = setInterval(updateStats, 7000)

            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        threshold: 0.5,
      }
    )

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current)
    }

    return () => clearInterval(interval)
  }, [])

  return (
    <dl
      ref={statsSectionRef}
      className='mt-16 grid gap-14 sm:mt-20 sm:grid-cols-3 sm:gap-3 lg:mt-24 xl:mt-28'
    >
      <div className='flex flex-col items-center justify-center'>
        <dt className='text-aqua-50/80 text-center text-xs font-extrabold tracking-widest uppercase'>
          Wallets Holding FLUX
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 font-mono! text-3xl font-bold'>
          {stats.isLoading ? (
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-8 w-16 rounded"></div>
          ) : (
            <Odometer value={stats.activeWallets} />
          )}
        </dd>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <dt className='text-aqua-50/80 text-center text-xs font-extrabold tracking-widest uppercase'>
          FLUX Price Since Launch
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 flex items-center text-center font-mono! text-3xl font-bold'>
          {stats.isLoading ? (
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-8 w-24 rounded"></div>
          ) : (
            <>
              ${(stats.currentPrice).toFixed(4)}
              <div className='ml-3 flex gap-2'>
                <div className='flex items-center gap-1'>
                  {stats.currentPrice >= LAUNCH_PRICE ? (
                    <svg
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      stroke='currentColor'
                      strokeWidth='2'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      aria-hidden='true'
                      className='size-4 stroke-[3px] text-green-400'
                    >
                      <path d='m22 7-7.869 7.869c-.396.396-.594.594-.822.668a1 1 0 0 1-.618 0c-.228-.074-.426-.272-.822-.668L9.13 12.13c-.396-.396-.594-.594-.822-.668a1 1 0 0 0-.618 0c-.228.074-.426.272-.822.668L2 17M22 7h-7m7 0v7'></path>
                    </svg>
                  ) : (
                    <svg
                      viewBox='0 0 24 24'
                      width='24'
                      height='24'
                      stroke='currentColor'
                      strokeWidth='2'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      aria-hidden='true'
                      className='size-4 stroke-[3px] text-red-400'
                    >
                      <path d='m22 17-7.869-7.869c-.396-.396-.594-.594-.822-.668a1 1 0 0 0-.618 0c-.228.074-.426.272-.822.668L9.13 11.87c-.396.396-.594.594-.822.668a1 1 0 0 1-.618 0c-.228-.074-.426-.272-.822-.668L2 7M22 17h-7m7 0v-7'></path>
                    </svg>
                  )}
                  <span className={`text-sm font-medium ${
                    stats.currentPrice >= LAUNCH_PRICE ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stats.currentPrice > 0 ? 
                      (((stats.currentPrice - LAUNCH_PRICE) / LAUNCH_PRICE) * 100).toFixed(1)
                      : '0'
                    }%
                  </span>
                </div>
                <span className='text-tertiary hidden text-sm font-medium'>
                  since launch
                </span>
              </div>
            </>
          )}
        </dd>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <dt className='text-aqua-50/80 text-center text-xs font-extrabold tracking-widest uppercase'>
          Total FLUX in Circulation
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 text-center font-mono! text-3xl font-bold'>
          {stats.isLoading ? (
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-8 w-20 rounded"></div>
          ) : (
            <Odometer value={Math.floor(stats.totalSupply)} />
          )}
        </dd>
      </div>
    </dl>
  )
}
