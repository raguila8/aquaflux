'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'

interface TransactionNotificationProps {
  title: string
  description: string
  type?: 'success' | 'error' | 'info'
  confirmLabel?: string
  onConfirm?: () => void
  onClose?: () => void
}

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-icon="true" className="z-1">
    <path d="m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"></path>
  </svg>
)

const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-icon="true" className="z-1">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
)

const InfoCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-icon="true" className="z-1">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-inherit-all shrink-0 size-5">
    <path d="M17 7 7 17M7 7l10 10"></path>
  </svg>
)

export const TransactionNotification = ({
  title,
  description,
  type = 'success',
  confirmLabel = 'View on Basescan',
  onConfirm,
  onClose,
}: TransactionNotificationProps) => {
  const iconColor = type === 'success' ? 'text-fg-success-primary' : type === 'error' ? 'text-fg-error-primary' : 'text-fg-brand-primary'
  const borderColor = type === 'success' ? 'before:border-fg-success-primary/30 after:border-fg-success-primary/10' : 
                      type === 'error' ? 'before:border-fg-error-primary/30 after:border-fg-error-primary/10' : 
                      'before:border-fg-brand-primary/30 after:border-fg-brand-primary/10'
  
  const Icon = type === 'success' ? CheckCircleIcon : type === 'error' ? AlertCircleIcon : InfoCircleIcon

  return (
    <div className="bg-primary ring-secondary_alt xs:w-[var(--width)] xs:flex-row shadow-inner-blur-secondary relative z-[var(--z-index)] flex max-w-full flex-col gap-4 rounded-xl p-4 ring">
      <div data-featured-icon="true" className={`relative flex shrink-0 items-center justify-center *:data-icon:size-5 before:absolute before:rounded-full before:border-2 after:absolute after:rounded-full after:border-2 size-5 before:size-7 after:size-9.5 ${iconColor} ${borderColor}`}>
        <Icon />
      </div>
      <div className="flex flex-1 flex-col gap-3 md:pr-8 md:pt-0.5">
        <div className="flex flex-col gap-1">
          <p className="text-fg-primary text-sm font-semibold">{title}</p>
          <p className="text-fg-secondary text-sm">{description}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="group relative inline-flex h-max cursor-pointer items-center whitespace-nowrap outline-brand transition duration-200 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 in-data-input-wrapper:shadow-xs in-data-input-wrapper:focus:!z-50 in-data-input-wrapper:in-data-leading:-mr-px in-data-input-wrapper:in-data-leading:rounded-r-none in-data-input-wrapper:in-data-leading:before:rounded-r-none in-data-input-wrapper:in-data-trailing:-ml-px in-data-input-wrapper:in-data-trailing:rounded-l-none in-data-input-wrapper:in-data-trailing:before:rounded-l-none disabled:cursor-not-allowed disabled:text-fg-disabled disabled:*:data-icon:text-fg-disabled_subtle *:data-icon:pointer-events-none *:data-icon:size-4 *:data-icon:shrink-0 *:data-icon:transition-inherit-all px-3 py-2 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2 in-data-input-wrapper:px-3.5 in-data-input-wrapper:py-2.5 in-data-input-wrapper:data-icon-only:p-2.5 justify-normal rounded-xs p-0! text-tertiary hover:text-tertiary_hover *:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current *:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover gap-1" 
            type="button"
          >
            <span data-text="true" className="transition-inherit-all z-10">Dismiss</span>
          </button>
          {confirmLabel && onConfirm && (
            <button 
              onClick={onConfirm}
              className="group relative inline-flex h-max cursor-pointer items-center whitespace-nowrap outline-brand transition duration-200 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 in-data-input-wrapper:shadow-xs in-data-input-wrapper:focus:!z-50 in-data-input-wrapper:in-data-leading:-mr-px in-data-input-wrapper:in-data-leading:rounded-r-none in-data-input-wrapper:in-data-leading:before:rounded-r-none in-data-input-wrapper:in-data-trailing:-ml-px in-data-input-wrapper:in-data-trailing:rounded-l-none in-data-input-wrapper:in-data-trailing:before:rounded-l-none disabled:cursor-not-allowed disabled:text-fg-disabled disabled:*:data-icon:text-fg-disabled_subtle *:data-icon:pointer-events-none *:data-icon:size-4 *:data-icon:shrink-0 *:data-icon:transition-inherit-all px-3 py-2 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2 in-data-input-wrapper:px-3.5 in-data-input-wrapper:py-2.5 in-data-input-wrapper:data-icon-only:p-2.5 justify-normal rounded-xs p-0! text-brand-primary hover:text-brand-primary_hover *:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current *:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover gap-1" 
              type="button"
            >
              <span data-text="true" className="transition-inherit-all z-10">{confirmLabel}</span>
            </button>
          )}
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center justify-center">
        <button 
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center rounded-lg p-2 transition duration-100 ease-linear focus:outline-hidden size-9 text-fg-quaternary hover:bg-primary_hover hover:shadow-inner-blur-no-border hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 outline-focus-ring" 
          type="button" 
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

// Helper functions to show notifications
export const showTransactionSuccess = (title: string, description: string, onConfirm?: () => void) => {
  return toast.custom((t) => (
    <TransactionNotification
      title={title}
      description={description}
      type="success"
      onConfirm={onConfirm}
      onClose={() => toast.dismiss(t)}
    />
  ), {
    duration: 7000,
    className: 'bg-transparent border-0 shadow-none p-0',
  })
}

export const showTransactionError = (title: string, description: string, onConfirm?: () => void) => {
  return toast.custom((t) => (
    <TransactionNotification
      title={title}
      description={description}
      type="error"
      onConfirm={onConfirm}
      onClose={() => toast.dismiss(t)}
    />
  ), {
    duration: 7000,
    className: 'bg-transparent border-0 shadow-none p-0',
  })
}

export const showTransactionInfo = (title: string, description: string, onConfirm?: () => void) => {
  return toast.custom((t) => (
    <TransactionNotification
      title={title}
      description={description}
      type="info"
      confirmLabel={onConfirm ? 'View on Basescan' : undefined}
      onConfirm={onConfirm}
      onClose={() => toast.dismiss(t)}
    />
  ), {
    duration: 5000,
    className: 'bg-transparent border-0 shadow-none p-0',
  })
}