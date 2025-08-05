'use client'

import { SidebarNavigationSimple } from '@/components/application/app-navigation/sidebar-navigation/sidebar-simple'
import { Badge } from '@/components/base/badges/badges'
import { FeaturedCardQRCode } from '@/components/application/app-navigation/base-components/featured-cards'
import { usePathname } from 'next/navigation'

import {
  Home03,
  Rows01,
  PieChart02,
  Stars01,
  HelpCircle,
  CoinsSwap01,
} from '@untitledui-pro/icons/solid'

export const AquafluxSidebar = () => {
  const pathname = usePathname()

  return (
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
          onConfirm={() => {}}
          onDismiss={() => {}}
          showCloseButton={false}
        />
      }
    />
  )
}
