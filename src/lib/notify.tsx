'use client'

import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'

type SuccessArgs = {
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
  }: SuccessArgs) {
    toast.custom((t) => (
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
  // Add error, warning, info variants as needed
}
