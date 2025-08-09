'use client'

import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'

interface ToastOptions {
  title: string
  description: string
  confirmLabel?: string
  onConfirm?: () => void
}

export const showSuccessToast = ({ title, description, confirmLabel, onConfirm }: ToastOptions) => {
  return toast.custom(
    (t) => (
      <div className="dark">
        <IconNotification
          title={title}
          description={description}
          color="success"
          confirmLabel={confirmLabel}
          onClose={() => toast.dismiss(t)}
          onConfirm={() => {
            onConfirm?.()
            toast.dismiss(t)
          }}
        />
      </div>
    ),
    {
      className: 'bg-transparent border-0 shadow-none p-0',
      duration: 7000,
    }
  )
}

export const showErrorToast = ({ title, description, confirmLabel, onConfirm }: ToastOptions) => {
  return toast.custom(
    (t) => (
      <div className="dark">
        <IconNotification
          title={title}
          description={description}
          color="error"
          confirmLabel={confirmLabel}
          onClose={() => toast.dismiss(t)}
          onConfirm={() => {
            onConfirm?.()
            toast.dismiss(t)
          }}
        />
      </div>
    ),
    {
      className: 'bg-transparent border-0 shadow-none p-0',
      duration: 7000,
    }
  )
}

export const showInfoToast = ({ title, description, confirmLabel, onConfirm }: ToastOptions) => {
  return toast.custom(
    (t) => (
      <div className="dark">
        <IconNotification
          title={title}
          description={description}
          color="brand"
          confirmLabel={confirmLabel}
          onClose={() => toast.dismiss(t)}
          onConfirm={() => {
            onConfirm?.()
            toast.dismiss(t)
          }}
        />
      </div>
    ),
    {
      className: 'bg-transparent border-0 shadow-none p-0',
      duration: 5000,
    }
  )
}