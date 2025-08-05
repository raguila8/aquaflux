import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'

export const SuccessNotification = () => {
  const handleNotification = () => {
    toast.custom((t) => (
      <IconNotification
        title='Successfully updated profile'
        description='Your changes have been saved and your profile is live. Your team can make edits.'
        color='success'
        onClose={() => toast.dismiss(t)}
      />
    ))
  }

  return (
    <div
      className='absolute inset-0 flex cursor-pointer items-center justify-center'
      onClick={handleNotification}
    >
      {/* THIS IS FOR PREVIEW ONLY. */}
      <div className='w-full max-w-sm -translate-y-2'>
        <IconNotification
          title='Successfully updated profile'
          description='Your changes have been saved and your profile is live. Your team can make edits.'
          color='success'
        />
      </div>
    </div>
  )
}
