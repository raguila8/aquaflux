'use client'

import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle, InfoCircle } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import { CloseButton } from '@/components/base/buttons/close-button'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { cx } from '@/utils/cx'

const iconMap = {
  default: InfoCircle,
  brand: InfoCircle,
  gray: InfoCircle,
  error: AlertCircle,
  warning: AlertCircle,
  success: CheckCircle,
}

interface AlertProps {
  title: string
  description: ReactNode
  confirmLabel?: string
  color?: 'default' | 'brand' | 'gray' | 'error' | 'warning' | 'success'
  onClose?: () => void
  onConfirm?: () => void
  showClose?: boolean
}

export const AlertFloating = ({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  color = 'default',
  showClose = true,
}: AlertProps) => {
  return (
    <div className='border-primary bg-primary_alt relative flex flex-col gap-4 rounded-xl border p-4 shadow-xs md:flex-row'>
      <FeaturedIcon
        icon={iconMap[color]}
        color={color === 'default' ? 'gray' : color}
        theme={color === 'default' ? 'modern' : 'outline'}
        size='md'
      />

      <div className='flex flex-1 flex-col gap-3 md:w-0'>
        <div className='flex flex-col gap-1 overflow-auto'>
          <p className='text-secondary pr-8 text-sm font-semibold md:truncate md:pr-0'>
            {title}
          </p>
          <p className='text-tertiary text-sm'>{description}</p>
        </div>

        {(showClose || confirmLabel) && (
          <div className='flex gap-3'>
            {showClose && (
              <Button onClick={onClose} size='sm' color='link-gray'>
                Dismiss
              </Button>
            )}
            {confirmLabel && (
              <Button onClick={onConfirm} size='sm' color='link-color'>
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>

      {showClose && (
        <div className='absolute top-2 right-2 flex items-center justify-center'>
          <CloseButton onClick={onClose} size='sm' label='Dismiss' />
        </div>
      )}
    </div>
  )
}

export const AlertFullWidth = ({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  color = 'default',
  showClose = true,
  actionType = 'button',
}: AlertProps & { actionType?: 'button' | 'link' }) => {
  return (
    <div className='border-primary bg-secondary_subtle relative border-t md:border-t-0 md:border-b'>
      <div className='max-w-container mx-auto flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-3 md:px-8 md:py-3'>
        <div className='flex flex-1 flex-col gap-4 md:w-0 md:flex-row md:items-center'>
          <FeaturedIcon
            className='hidden md:flex'
            icon={iconMap[color]}
            color={color === 'default' ? 'gray' : color}
            theme={color === 'default' ? 'modern' : 'outline'}
            size='md'
          />

          <div className='flex flex-col gap-0.5 overflow-hidden lg:flex-row lg:gap-1.5'>
            <p className='text-secondary pr-8 text-sm font-semibold md:truncate md:pr-0'>
              {title}
            </p>
            <p className='text-tertiary text-sm md:truncate'>{description}</p>
          </div>
        </div>
        {(showClose || confirmLabel) && (
          <div className='flex gap-2'>
            {(showClose || confirmLabel) && (
              <div
                className={cx(
                  'flex w-full gap-3',
                  actionType === 'button'
                    ? 'flex-col-reverse md:flex-row'
                    : 'flex-row'
                )}
              >
                {showClose && (
                  <Button
                    onClick={onClose}
                    color={actionType === 'button' ? 'secondary' : 'link-gray'}
                    size={actionType === 'button' ? 'md' : 'sm'}
                  >
                    Dismiss
                  </Button>
                )}
                {confirmLabel && (
                  <Button
                    onClick={onConfirm}
                    color={actionType === 'button' ? 'primary' : 'link-color'}
                    size={actionType === 'button' ? 'md' : 'sm'}
                  >
                    {confirmLabel}
                  </Button>
                )}
              </div>
            )}
            {showClose && (
              <div className='absolute top-2 right-2 flex shrink-0 items-center justify-center md:static'>
                <CloseButton onClick={onClose} size='sm' label='Dismiss' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
