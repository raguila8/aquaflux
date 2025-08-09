'use client'

import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'

type NotificationArgs = {
  title?: string
  description?: string
  confirmLabel?: string
  onConfirm?: () => void
}

export const notify = {
  success({
    title = 'Success',
    description = '',
    confirmLabel,
    onConfirm,
  }: NotificationArgs) {
    return toast.custom((t) => (
      <IconNotification
        title={title}
        description={description}
        {...(confirmLabel && { confirmLabel })}
        color='success'
        onClose={() => toast.dismiss(t)}
        onConfirm={() => {
          onConfirm?.()
          toast.dismiss(t)
        }}
      />
    ))
  },
  
  info({
    title = 'Info',
    description = '',
    confirmLabel,
    onConfirm,
  }: NotificationArgs) {
    return toast.custom((t) => (
      <IconNotification
        title={title}
        description={description}
        {...(confirmLabel && { confirmLabel })}
        color='brand'
        onClose={() => toast.dismiss(t)}
        onConfirm={() => {
          onConfirm?.()
          toast.dismiss(t)
        }}
      />
    ))
  },
  
  error({
    title = 'Error',
    description = '',
    confirmLabel,
    onConfirm,
  }: NotificationArgs) {
    return toast.custom((t) => (
      <IconNotification
        title={title}
        description={description}
        {...(confirmLabel && { confirmLabel })}
        color='error'
        onClose={() => toast.dismiss(t)}
        onConfirm={() => {
          onConfirm?.()
          toast.dismiss(t)
        }}
      />
    ))
  },
}
