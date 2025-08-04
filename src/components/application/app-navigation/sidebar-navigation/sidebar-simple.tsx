'use client'

import type { ReactNode } from 'react'
import { SearchLg } from '@untitledui/icons'
import { Input } from '@/components/base/input/input'
import { AquafluxLogo } from '@/components/foundations/logo/aquaflux-logo'
import { cx } from '@/utils/cx'
import { MobileNavigationHeader } from '@/components/application/app-navigation/base-components/mobile-header'
import { NavAccountCard } from '@/components/application/app-navigation/base-components/nav-account-card'
import { NavItemBase } from '@/components/application/app-navigation/base-components/nav-item'
import { NavList } from '@/components/application/app-navigation/base-components/nav-list'
import { ContentDivider } from '@/components/application/content-divider/content-divider'
import type {
  NavItemType,
  NavItemDividerType,
} from '@/components/application/app-navigation/config'

interface SidebarNavigationProps {
  /** URL of the currently active item. */
  activeUrl?: string
  /** List of items to display. */
  items: (NavItemType | NavItemDividerType)[]
  /** List of footer items to display. */
  footerItems?: NavItemType[]
  /** Feature card to display. */
  featureCard?: ReactNode
  /** Whether to show the account card. */
  showAccountCard?: boolean
  /** Whether to hide the right side border. */
  hideBorder?: boolean
  /** Whether to show the search input. */
  showSearch?: boolean
  /** Additional CSS classes to apply to the sidebar. */
  className?: string
}

export const SidebarNavigationSimple = ({
  activeUrl,
  items,
  footerItems = [],
  featureCard,
  showAccountCard = true,
  hideBorder = false,
  showSearch = true,
  className,
}: SidebarNavigationProps) => {
  const MAIN_SIDEBAR_WIDTH = 296

  const content = (
    <aside
      style={
        {
          '--width': `${MAIN_SIDEBAR_WIDTH}px`,
        } as React.CSSProperties
      }
      className={cx(
        'bg-primary flex h-full w-full max-w-full flex-col justify-between overflow-auto pt-4 lg:w-(--width) lg:pt-6',
        !hideBorder && 'border-secondary md:border-r',
        className
      )}
    >
      <div className='flex flex-col gap-5 px-4 lg:px-5'>
        <AquafluxLogo className='h-7 pl-1.5' />

        {showSearch && (
          <Input
            shortcut
            size='sm'
            aria-label='Search'
            placeholder='Search'
            icon={SearchLg}
          />
        )}
      </div>

      {!showSearch && (
        <div className='w-full px-0.5 pt-6 pb-2'>
          <hr className='h-px border-none bg-linear-to-r from-transparent via-violet-200/15 to-transparent' />
        </div>
      )}

      <NavList activeUrl={activeUrl} items={items} />

      <div className='mt-auto flex flex-col gap-4 px-2 py-4 lg:px-4 lg:py-6'>
        {footerItems.length > 0 && (
          <ul className='flex flex-col'>
            {footerItems.map((item) => (
              <li key={item.label} className='py-0.5'>
                <NavItemBase
                  badge={item.badge}
                  icon={item.icon}
                  href={item.href}
                  type='link'
                  current={item.href === activeUrl}
                >
                  {item.label}
                </NavItemBase>
              </li>
            ))}
          </ul>
        )}

        {featureCard}

        {showAccountCard && <NavAccountCard />}
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile header navigation */}
      <MobileNavigationHeader>{content}</MobileNavigationHeader>

      {/* Desktop sidebar navigation */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex'>
        {content}
      </div>

      {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
      <div
        style={{
          paddingLeft: MAIN_SIDEBAR_WIDTH,
        }}
        className='invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block'
      />
    </>
  )
}
