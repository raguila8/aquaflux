'use client'

import { SidebarNavigationSimple } from '@/components/application/app-navigation/sidebar-navigation/sidebar-simple'
import { Badge } from '@/components/base/badges/badges'
import { FeaturedCardQRCode } from '@/components/application/app-navigation/base-components/featured-cards'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QRCodeModal } from '@/components/application/modals/qr-code-modal'
import { Button } from '@/components/base/buttons/button'
import { Toaster } from '@/components/application/notifications/toaster'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { useRealtimeTransactions } from '@/hooks/useRealtimeTransactions'

import Home03 from '@/icons/untitledui/pro/home-03.svg'
import Rows01 from '@/icons/untitledui/pro/rows-01.svg'
import PieChart02 from '@/icons/untitledui/pro/pie-chart-02.svg'
import Stars01 from '@/icons/untitledui/pro/stars-01.svg'
import HelpCircle from '@/icons/untitledui/pro/help-circle.svg'
import CoinsSwap01 from '@/icons/untitledui/pro/coin-swap-01.svg'
import CreditCardUp from '@/icons/untitledui/pro/credit-card-up.svg'
import Cryptocurrency03 from '@/icons/untitledui/pro/cryptocurrency-03.svg'

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected, address, disconnect } = useWallet()
  const [open2FA, setOpen2FA] = useState(false)
  const [transferMode, setTransferMode] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )
  const [tokenSymbol, setTokenSymbol] = useState('USDC')
  
  useRealtimeTransactions((transaction) => {
    console.log('New transaction received:', transaction);
  });
  
  const handleSignOut = async () => {
    await disconnect();
    router.push('/');
  };

  // Dynamic title based on pathname
  const getPageTitle = (path: string): string => {
    if (path === '/dashboard') return 'Aquaflux Dashboard'
    if (path === '/dashboard/transactions') return 'Aquaflux Transactions'
    if (path === '/dashboard/analytics') return 'Aquaflux Analytics'

    // Fallback: extract the last segment and capitalize
    const segments = path.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : 'Dashboard'
  }

  const title = getPageTitle(pathname)

  // Dynamic subtitle based on pathname
  const getPageSubtitle = (path: string): string => {
    if (path === '/dashboard')
      return 'Real time portfolio, token price, and transaction history.'
    if (path === '/dashboard/analytics')
      return 'Performance, allocations, and liquidity. Updated in real time.'
    if (path === '/dashboard/transactions')
      return 'Full history of deposits and withdrawals with fees, hashes, and status.'
    // Default subtitle
    return 'Lorem ipsum dolor sit amet vestibulum augue.'
  }

  const subtitle = getPageSubtitle(pathname)

  return (
    <>
      <SidebarNavigationSimple
        hideBorder
        showSearch={false}
        activeUrl={pathname}
        items={[
          {
            label: 'Home',
            href: '/dashboard',
            icon: Home03,
          },
          {
            label: 'Transactions',
            href: '/dashboard/transactions',
            icon: Rows01,
          },

          {
            label: 'Flux Analytics',
            href: '/dashboard/analytics',
            icon: PieChart02,
          },
          {
            label: 'Swap',
            href: '#',
            icon: CoinsSwap01,
            badge: (
              <Badge size='sm' type='modern'>
                Coming soon
              </Badge>
            ),
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
            description='Open your wallet and scan the QR code below to deposit USDC on Base.'
            confirmLabel='Fund wallet'
            onConfirm={() => {
              setTransferMode('deposit')
              setTokenSymbol('USDC')
              setOpen2FA(true)
            }}
            onDismiss={() => {}}
            showCloseButton={false}
          />
        }
      />
      <main className='min-w-0 flex-1 lg:pt-2'>
        <div className='border-secondary bg-secondary_subtle/60 flex h-full min-h-[calc(100vh_-_8px)] flex-col gap-8 px-6 pt-8 pb-12 shadow-xs lg:rounded-tl-[32px] lg:border-t lg:border-l lg:px-8 lg:pt-10'>
          <div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-8'>
            {/* Page header */}
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col justify-between gap-4 lg:flex-row'>
                <div className='flex flex-col gap-0.5 lg:gap-1'>
                  <p className='text-primary lg:text-display-xs text-xl font-semibold'>
                    {title}
                  </p>
                  <p className='text-md text-tertiary'>{subtitle}</p>
                </div>
                <div className='flex gap-3'>
                  <Button
                    size='md'
                    color='secondary'
                    iconLeading={CreditCardUp}
                    onClick={() => {
                      setTransferMode('withdraw')
                      setTokenSymbol('FLUX')
                      setOpen2FA(true)
                    }}
                  >
                    Withdraw
                  </Button>
                  <Button
                    size='md'
                    iconLeading={Cryptocurrency03}
                    onClick={() => {
                      setTransferMode('deposit')
                      setTokenSymbol('USDC')
                      setOpen2FA(true)
                    }}
                  >
                    Deposit
                  </Button>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </main>

      <QRCodeModal
        isOpen={open2FA}
        onOpenChange={setOpen2FA}
        mode={transferMode}
        tokenSymbol={tokenSymbol}
      />
      <Toaster />
    </>
  )
}
