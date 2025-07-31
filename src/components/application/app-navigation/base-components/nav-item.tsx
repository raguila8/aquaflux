'use client'

import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { ChevronDown, Share04 } from '@untitledui/icons'
import { Link as AriaLink } from 'react-aria-components'
import { Badge } from '@/components/base/badges/badges'
import { cx, sortCx } from '@/utils/cx'

const styles = sortCx({
  root: 'group relative flex w-full cursor-pointer items-center rounded-md bg-transparent outline-focus-ring transition duration-100 ease-linear select-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2',
  rootSelected:
    'bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] shadow-inner-blur-secondary! after:absolute after:inset-0 after:border-indigo-blue-200/[.03] after:border after:rounded-md',
})

interface NavItemBaseProps {
  /** Whether the nav item shows only an icon. */
  iconOnly?: boolean
  /** Whether the collapsible nav item is open. */
  open?: boolean
  /** URL to navigate to when the nav item is clicked. */
  href?: string
  /** Type of the nav item. */
  type: 'link' | 'collapsible' | 'collapsible-child'
  /** Icon component to display. */
  icon?: FC<HTMLAttributes<HTMLOrSVGElement>>
  /** Badge to display. */
  badge?: ReactNode
  /** Whether the nav item is currently active. */
  current?: boolean
  /** Whether to truncate the label text. */
  truncate?: boolean
  /** Handler for click events. */
  onClick?: MouseEventHandler
  /** Content to display. */
  children?: ReactNode
}

export const NavItemBase = ({
  current,
  type,
  badge,
  href,
  icon: Icon,
  children,
  truncate = true,
  onClick,
}: NavItemBaseProps) => {
  const iconElement = Icon && (
    <Icon
      aria-hidden='true'
      className={cx(
        'text-indigo-blue-100/60 transition-inherit-all group-hover:text-indigo-blue-100 [&_path[data-accent=true]]:fill-indigo-blue-100/60 [&_path[data-accent=true]]:group-hover:fill-indigo-blue-100/85 mr-2.5 size-4.5 shrink-0 [&_path[data-accent=true]]:duration-200 [&_path[data-accent=true]]:ease-in-out',
        current &&
          'text-indigo-blue-100 [&_path[data-accent=true]]:fill-indigo-blue-100/85'
      )}
    />
  )

  const badgeElement =
    badge && (typeof badge === 'string' || typeof badge === 'number') ? (
      <Badge className='ml-3' color='gray' type='pill-color' size='sm'>
        {badge}
      </Badge>
    ) : (
      badge
    )

  const labelElement = (
    <span
      className={cx(
        'text-brand-50/90 transition-inherit-all group-hover:text-secondary_hover flex-1 text-[15px] font-semibold',
        truncate && 'truncate',
        current && 'text-brand-50'
      )}
    >
      {children}
    </span>
  )

  const isExternal = href && href.startsWith('http')
  const externalIcon = isExternal && (
    <Share04 className='text-fg-quaternary size-4 stroke-[2.5px]' />
  )

  if (type === 'collapsible') {
    return (
      <summary
        className={cx(
          'px-3 py-2',
          styles.root,
          current ? styles.rootSelected : ''
        )}
        onClick={onClick}
      >
        {iconElement}

        {labelElement}

        {badgeElement}

        <ChevronDown
          aria-hidden='true'
          className='text-fg-quaternary ml-3 size-4 shrink-0 stroke-[2.5px] in-open:-scale-y-100'
        />
      </summary>
    )
  }

  if (type === 'collapsible-child') {
    return (
      <AriaLink
        href={href!}
        target={isExternal ? '_blank' : '_self'}
        rel='noopener noreferrer'
        className={cx(
          'py-2 pr-3 pl-10',
          styles.root,
          current && styles.rootSelected
        )}
        onClick={onClick}
        aria-current={current ? 'page' : undefined}
      >
        {labelElement}
        {externalIcon}
        {badgeElement}
      </AriaLink>
    )
  }

  return (
    <AriaLink
      href={href!}
      target={isExternal ? '_blank' : '_self'}
      rel='noopener noreferrer'
      className={cx(
        'px-3 py-2',
        styles.root,
        current
          ? styles.rootSelected
          : 'hover:shadow-inner-blur-no-border hover:bg-secondary_subtle/90'
      )}
      onClick={onClick}
      aria-current={current ? 'page' : undefined}
    >
      {iconElement}
      {labelElement}
      {externalIcon}
      {badgeElement}
    </AriaLink>
  )
}
