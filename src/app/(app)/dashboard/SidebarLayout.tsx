'use client'

import { SidebarNavigationSimple } from '@/components/application/app-navigation/sidebar-navigation/sidebar-simple'
import { Badge } from '@/components/base/badges/badges'
import { FeaturedCardQRCode } from '@/components/application/app-navigation/base-components/featured-cards'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { TWOFACodeModal } from '@/components/application/modals/twofa-code-modal'
import { Button } from '@/components/base/buttons/button'
import { CreditCardUp, Cryptocurrency03 } from '@untitledui-pro/icons/solid'
import { Toaster } from '@/components/application/notifications/toaster'

import {
  Home03,
  Rows01,
  PieChart02,
  Stars01,
  HelpCircle,
  CoinsSwap01,
} from '@untitledui-pro/icons/solid'

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [open2FA, setOpen2FA] = useState(false)
  const [transferMode, setTransferMode] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )
  const [tokenSymbol, setTokenSymbol] = useState('USDC')

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
  const subtitle = 'Lorem ipsum dolor sit amet vestibulum augue.'

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
            description='Open your wallet and scan the QR code below to deposit USDC on Arbitrum.'
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

      <TWOFACodeModal
        isOpen={open2FA}
        onOpenChange={setOpen2FA}
        mode={transferMode}
        tokenSymbol={tokenSymbol}
      />
      <Toaster />
    </>
  )
}
