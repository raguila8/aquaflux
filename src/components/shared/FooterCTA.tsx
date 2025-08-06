'use client'

import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'

const spaceSpotlight = 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/space-spotlight.avif'

export function FooterCTA() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();
  
  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else {
      connect();
    }
  };
  return (
    <>
      <Container className='py-16 sm:py-20 lg:py-24'>
        {/* Text content */}
        <div className='relative z-10 flex flex-col items-center'>
          <h1 className='leading-extratight text-indigo-blue-100 max-w-5xl text-center text-4xl font-bold sm:text-5xl sm:leading-tight'>
            Boost your earnings.
            <br />
            Start using our app&nbsp;
            <span className='relative inline-block text-nowrap'>
              <span className='from-aqua-500 to-indigo-blue-700 relative z-10 bg-linear-to-b from-8% to-80% bg-clip-text text-transparent'>
                today.
              </span>
              <span className='text-aqua-300 absolute -top-px left-0 -z-10'>
                today.
              </span>
            </span>
          </h1>
          <p className='mt-5 max-w-xl text-center text-[17px] leading-8 text-slate-300 sm:text-lg sm:leading-8'>
            Flux gives you a piece of our secured vault. Our bot taps that
            hardware wallet to trade on Balancer v3, growing the
            value of every token.
          </p>
          <div className='mt-8 flex items-center justify-center space-x-3 sm:space-x-5'>
            <Button onClick={handleGetStarted}> 
              {isConnected ? 'Go to Dashboard' : 'Get started'} 
            </Button>
          </div>
        </div>
      </Container>

      <Image
        src={spaceSpotlight}
        alt=''
        className='absolute -bottom-3/4 left-1/2 h-auto w-full max-w-3xl -translate-x-1/2 object-contain opacity-80 sm:max-w-4xl md:-bottom-full lg:-bottom-[165%] lg:max-w-[1800px]'
      />
    </>
  )
}
