'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Odometer = dynamic(() => import('react-odometerjs'), { ssr: false })

export const Stats = () => {
  const [stats, setStats] = useState({
    activeWallets: 1420,
    priceOfFlux: 10310,
    telegramUsers: 244,
  })

  const statsRef = useRef(stats)
  statsRef.current = stats

  const statsSectionRef = useRef<HTMLDListElement | null>(null)

  useEffect(() => {
    const fetchMockStats = (): Promise<typeof statsRef.current> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            activeWallets:
              statsRef.current.activeWallets + Math.floor(Math.random() * 5),
            priceOfFlux:
              statsRef.current.priceOfFlux + Math.floor(Math.random() * 5),
            telegramUsers:
              statsRef.current.telegramUsers + Math.floor(Math.random() * 3),
          })
        }, 500)
      })
    }

    const updateStats = () => {
      fetchMockStats().then((data) => {
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
          Active wallets connected
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 font-mono! text-3xl font-bold'>
          <Odometer value={stats.activeWallets} />
        </dd>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <dt className='text-aqua-50/80 text-center text-xs font-extrabold tracking-widest uppercase'>
          Flux Price Since Launch
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 flex items-center text-center font-mono! text-3xl font-bold'>
          $<Odometer value={stats.priceOfFlux} />
          <div className='ml-3 flex gap-2'>
            <div className='flex items-center gap-1'>
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
              <span className='text-sm font-medium text-green-400'>70%</span>
            </div>
            <span className='text-tertiary hidden text-sm font-medium'>
              vs last month
            </span>
          </div>
        </dd>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <dt className='text-aqua-50/80 text-center text-xs font-extrabold tracking-widest uppercase'>
          Telegram users joined
        </dt>
        <dd className='odometer text-indigo-blue-50 mt-4 text-center font-mono! text-3xl font-bold'>
          <Odometer value={stats.telegramUsers} />
        </dd>
      </div>
    </dl>
  )
}
