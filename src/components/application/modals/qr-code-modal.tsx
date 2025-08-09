'use client'

import { useState } from 'react'
import { useClipboard } from '@/hooks/use-clipboard'
import { Copy01, Check } from '@untitledui/icons'
import CreditCardUp from '@/icons/untitledui/pro/credit-card-up.svg'
import Cryptocurrency03 from '@/icons/untitledui/pro/cryptocurrency-03.svg'
import { VAULT_ADDRESS } from '@/config/constants'
import { notify } from '@/lib/notify'
import { useWallet } from '@/contexts/WalletContext'
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
import * as Alerts from '@/components/application/alerts/alerts'

type TwoFACodeModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'deposit' | 'withdraw'
  tokenSymbol?: string
}

export const QRCodeModal = ({
  isOpen,
  onOpenChange,
  mode = 'deposit',
  tokenSymbol = 'USDC',
}: TwoFACodeModalProps) => {
  const { copy, copied } = useClipboard()
  const { showTransactionNotification } = useWallet()

  const titleText = mode === 'deposit' ? 'Deposit' : 'Withdraw'
  const labelText = `${tokenSymbol} deposit address on Base`
  const alertTitle = `Only deposit ${tokenSymbol} on the Base network.`
  const successTitle = `${titleText} successful`
  const address = VAULT_ADDRESS

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className='relative w-full max-w-128 overflow-hidden rounded-2xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] shadow-xl transition-all'>
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
                    icon={mode === 'deposit' ? Cryptocurrency03 : CreditCardUp}
                    className='shadow-inner-blur-secondary bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)]'
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
                    {titleText}
                  </AriaHeading>
                  <p className='text-tertiary text-sm'>
                    Scan the QR or copy the address to your wallet.
                  </p>
                </div>
              </div>
              <div className='h-5 w-full' />
              <div className='flex flex-col gap-4 px-4 sm:gap-5 sm:px-6'>
                <div className='bg-primary shadow-inner-blur-light relative flex w-full items-center justify-center rounded-lg p-5'>
                  <QRCode
                    value={address}
                    size='lg'
                    className='hidden sm:flex'
                  />
                  <QRCode
                    value={address}
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
                  label={labelText}
                  value={address}
                  onChange={() => {}}
                  className='font-mono'
                  inputClassName='shadow-inner-blur rounded-lg'
                />
                <Button
                  size='lg'
                  color='tertiary'
                  onClick={() => copy(address)}
                  iconLeading={copied ? Check : Copy01}
                />
              </div>
              <div className='mx-4.5 mt-4.5 sm:mx-6.5'>
                <Alerts.AlertFloating
                  color='warning'
                  title={alertTitle}
                  description='If you send anything else you can potentially lose your assets forever.'
                  showClose={false}
                  className='shadow-inner-blur-light'
                />
              </div>
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
                    onOpenChange(false);
                    // Test using the SAME function as WebSocket (should work perfectly)
                    showTransactionNotification({
                      hash: '0x1234567890abcdef1234567890abcdef12345678',
                      from: '0xtest',
                      to: VAULT_ADDRESS,
                      value: '100.00',
                      token: 'USDC',
                      type: 'deposit',
                      status: 'pending',
                      fee: '1.00',
                      timestamp: new Date().toISOString(),
                    });
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
