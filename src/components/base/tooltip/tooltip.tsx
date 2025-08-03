'use client'

import type { ReactNode } from 'react'
import type { Placement } from '@react-types/overlays'
import type {
  ButtonProps as AriaButtonProps,
  TooltipProps as AriaTooltipProps,
  TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
} from 'react-aria-components'
import {
  Button as AriaButton,
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components'
import { cx } from '@/utils/cx'

const transformOrigins: Partial<Record<Placement, string>> = {
  top: 'origin-bottom',
  'top left': 'origin-bottom-left',
  'top right': 'origin-bottom-right',
  bottom: 'origin-top',
  'bottom left': 'origin-top-left',
  'bottom right': 'origin-top-right',
  left: 'origin-right',
  'left top': 'origin-top-right',
  'left bottom': 'origin-bottom-right',
  start: 'origin-right',
  'start top': 'origin-top-left',
  'start bottom': 'origin-bottom-left',
  right: 'origin-left',
  'right top': 'origin-top-left',
  'right bottom': 'origin-bottom-left',
  end: 'origin-left',
  'end top': 'origin-top-left',
  'end bottom': 'origin-bottom-left',
}

interface TooltipProps
  extends AriaTooltipTriggerComponentProps,
    Omit<AriaTooltipProps, 'children'> {
  /**
   * The title of the tooltip.
   */
  title: ReactNode
  /**
   * The description of the tooltip.
   */
  description?: ReactNode
  /**
   * Whether to show the arrow on the tooltip.
   *
   * @default false
   */
  arrow?: boolean
  /**
   * Delay in milliseconds before the tooltip is shown.
   *
   * @default 300
   */
  delay?: number
  /**
   * Additional CSS classes to apply to the tooltip content.
   */
  className?: string
}

export const Tooltip = ({
  title,
  description,
  children,
  arrow = false,
  delay = 300,
  closeDelay = 0,
  trigger,
  isDisabled,
  isOpen,
  defaultOpen,
  offset = 6,
  crossOffset,
  placement = 'top',
  onOpenChange,
  className,
  ...tooltipProps
}: TooltipProps) => {
  const isTopOrBottomLeft = [
    'top left',
    'top end',
    'bottom left',
    'bottom end',
  ].includes(placement)
  const isTopOrBottomRight = [
    'top right',
    'top start',
    'bottom right',
    'bottom start',
  ].includes(placement)
  // Set negative cross offset for left and right placement to visually balance the tooltip.
  const calculatedCrossOffset = isTopOrBottomLeft
    ? -12
    : isTopOrBottomRight
      ? 12
      : 0

  return (
    <AriaTooltipTrigger
      {...{
        trigger,
        delay,
        closeDelay,
        isDisabled,
        isOpen,
        defaultOpen,
        onOpenChange,
      }}
    >
      {children}

      <AriaTooltip
        {...tooltipProps}
        offset={offset}
        placement={placement}
        crossOffset={crossOffset ?? calculatedCrossOffset}
        className={({ isEntering, isExiting }) =>
          cx(
            isEntering && 'animate-in ease-out',
            isExiting && 'animate-out ease-in'
          )
        }
      >
        {({ isEntering, isExiting }) => (
          <div
            className={cx(
              'bg-primary-solid z-50 flex max-w-xs min-w-0 flex-col items-start gap-1 rounded-lg px-3 break-words shadow-lg will-change-transform',
              description ? 'py-3' : 'py-2',

              // Map placements to transform-origin
              transformOrigins[placement],

              isEntering &&
                'animate-in fade-in zoom-in-95 in-placement-left:slide-in-from-right-0.5 in-placement-right:slide-in-from-left-0.5 in-placement-top:slide-in-from-bottom-0.5 in-placement-bottom:slide-in-from-top-0.5 ease-out',
              isExiting &&
                'animate-out fade-out zoom-out-95 in-placement-left:slide-out-to-right-0.5 in-placement-right:slide-out-to-left-0.5 in-placement-top:slide-out-to-bottom-0.5 in-placement-bottom:slide-out-to-top-0.5 ease-in',

              className
            )}
          >
            <span className='w-full text-xs font-semibold break-words text-white'>
              {title}
            </span>

            {description && (
              <span className='text-tooltip-supporting-text w-full text-xs font-medium break-words'>
                {description}
              </span>
            )}

            {arrow && (
              <AriaOverlayArrow>
                <svg
                  viewBox='0 0 100 100'
                  className='fill-bg-primary-solid in-placement-left:-rotate-90 in-placement-right:rotate-90 in-placement-top:rotate-0 in-placement-bottom:rotate-180 size-2.5'
                >
                  <path d='M0,0 L35.858,35.858 Q50,50 64.142,35.858 L100,0 Z' />
                </svg>
              </AriaOverlayArrow>
            )}
          </div>
        )}
      </AriaTooltip>
    </AriaTooltipTrigger>
  )
}

interface TooltipTriggerProps extends AriaButtonProps {}

export const TooltipTrigger = ({
  children,
  className,
  ...buttonProps
}: TooltipTriggerProps) => {
  return (
    <AriaButton
      {...buttonProps}
      className={(values) =>
        cx(
          'h-max w-max outline-hidden',
          typeof className === 'function' ? className(values) : className
        )
      }
    >
      {children}
    </AriaButton>
  )
}
