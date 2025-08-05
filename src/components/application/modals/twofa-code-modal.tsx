'use client'

import { notify } from '@/lib/notify'
import { useState } from 'react'
import { useClipboard } from '@/hooks/use-clipboard'
import { Lock01, Copy01, Check } from '@untitledui/icons'
import { CreditCardUp, Cryptocurrency03 } from '@untitledui-pro/icons/solid'
import {
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
} from 'react-aria-components'
import {
  Dialog,
  Modal,
  ModalOverlay,
} from '@/components/application/modals/modal'
import { Button } from '@/components/base/buttons/button'
import { CloseButton } from '@/components/base/buttons/close-button'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icons'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { GradientScan, QRCode } from '@/components/shared-assets/qr-code'
import { Input } from '@/components/base/input/input'

type TwoFACodeModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const TWOFACodeModal = ({
  isOpen,
  onOpenChange,
}: TwoFACodeModalProps) => {
  const [value, setValue] = useState(
    '0x05d242f6686122ae37e003be9f11e3a9f7bb6390f8e43de216c89f44c28f4595'
  )
  const { copy, copied } = useClipboard()

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className='bg-primary relative w-full max-w-128 overflow-hidden rounded-2xl shadow-xl transition-all'>
              <CloseButton
                onClick={() => onOpenChange(false)}
                theme='light'
                size='lg'
                className='absolute top-3 right-3'
              />
              <div className='flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6'>
                <div className='relative w-max'>
                  <FeaturedIcon
                    color='gray'
                    size='lg'
                    theme='modern'
                    icon={Cryptocurrency03}
                  />

                  <BackgroundPattern
                    pattern='circle'
                    size='sm'
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  />
                </div>
                <div className='z-10 flex flex-col gap-0.5'>
                  <AriaHeading
                    slot='title'
                    className='text-md text-primary font-semibold'
                  >
                    Deposit
                  </AriaHeading>
                  <p className='text-tertiary text-sm'>
                    Scan the QR or copy the address to your wallet.
                  </p>
                </div>
              </div>
              <div className='h-5 w-full' />
              <div className='flex flex-col gap-4 px-4 sm:gap-5 sm:px-6'>
                <div className='bg-secondary relative flex w-full items-center justify-center rounded-lg p-5'>
                  <QRCode
                    value='0x9749a2817894a0f8aff9977efc5d0aaaad6133a94247b1ee3ab707c2bfe7d1d1'
                    size='lg'
                    className='hidden sm:flex'
                  />
                  <QRCode
                    value='https://www.tailawesome.com/'
                    size='md'
                    className='flex sm:hidden'
                  />
                  <GradientScan className='md:max-w-[calc(100%-40px)]' />
                </div>
              </div>
              <div className='h-5 w-full' />
              <div className='flex flex-row items-end justify-end gap-1 px-4 sm:gap-[5px] sm:px-6'>
                <Input
                  isReadOnly
                  size='md'
                  label='USDC Deposit address'
                  value={value}
                  onChange={setValue}
                  className='font-mono'
                />
                <Button
                  size='md'
                  color='tertiary'
                  onClick={() => copy(value)}
                  iconLeading={copied ? Check : Copy01}
                />
              </div>
              <p className='text-tertiary group-invalid:text-error-primary mt-2 px-4.5 text-sm sm:px-6.5'>
                Only deposit USDC on the ARB (Arbitrium) network. If you send
                anything else you can potentially lose your assets forever.
              </p>
              <div className='z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6'>
                <Button
                  color='secondary'
                  size='lg'
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  size='lg'
                  onClick={() => {
                    onOpenChange(false)
                    notify.success({
                      title: 'Deposit successful',
                      description:
                        'Lorem ipsum dolor sit amet hac erat vestibulum nunc fames.',
                    })
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  )
}
