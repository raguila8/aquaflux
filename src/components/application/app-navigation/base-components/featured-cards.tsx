'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/base/buttons/button'
import { CloseButton } from '@/components/base/buttons/close-button'
import { GradientScan, QRCode } from '@/components/shared-assets/qr-code'

interface FeaturedCardCommonProps {
  title: string
  description: ReactNode
  confirmLabel: string
  className?: string
  showCloseButton?: boolean
  onDismiss: () => void
  onConfirm: () => void
}

export const FeaturedCardQRCode = ({
  title,
  description,
  confirmLabel,
  showCloseButton = true,
  onConfirm,
  onDismiss,
}: FeaturedCardCommonProps) => {
  return (
    <div className='bg-primary ring-secondary relative flex flex-col gap-4 rounded-xl p-4 shadow-lg ring-1 ring-inset'>
      {showCloseButton && (
        <div className='absolute top-2 right-2'>
          <CloseButton size='sm' onClick={onDismiss} />
        </div>
      )}

      <div className='flex flex-col gap-1'>
        <p
          className={`text-primary truncate text-sm font-semibold ${showCloseButton ? 'pr-6' : ''}`}
        >
          {title}
        </p>
        <p className='text-tertiary text-sm'>{description}</p>
      </div>
      <div className='relative flex w-full items-center justify-center'>
        <QRCode value='https://www.untitledui.com/' size='md' />
        <GradientScan />
      </div>
      <Button color='secondary' size='sm' onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  )
}
