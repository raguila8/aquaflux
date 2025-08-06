'use client'

import { useState } from 'react'
import { TWOFACodeModal } from '@/components/application/modals/qr-code-modal'
import { Button } from '@/components/base/buttons/button'
import { CreditCardUp, Cryptocurrency03 } from '@untitledui-pro/icons/solid'

export const DashboardHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  const [open2FA, setOpen2FA] = useState(false)
  const [transferMode, setTransferMode] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )
  const [tokenSymbol, setTokenSymbol] = useState('USDC')

  return (
    <>
      <div className='flex flex-col gap-5'>
        {/* Page header */}
        <div className='flex flex-col justify-between gap-4 lg:flex-row'>
          <div className='flex flex-col gap-0.5 lg:gap-1'>
            <p className='text-primary lg:text-display-xs text-xl font-semibold'>
              {title}
            </p>
            <p className='text-md text-tertiary'>{subtitle}</p>
          </div>
          <div className='flex gap-3'>
            <Button
              size='md'
              color='secondary'
              iconLeading={CreditCardUp}
              onClick={() => {
                setTransferMode('withdraw')
                setTokenSymbol('FLUX')
                setOpen2FA(true)
              }}
            >
              Withdraw
            </Button>
            <Button
              size='md'
              iconLeading={Cryptocurrency03}
              onClick={() => {
                setTransferMode('deposit')
                setTokenSymbol('USDC')
                setOpen2FA(true)
              }}
            >
              Deposit
            </Button>
          </div>
        </div>
      </div>
      <TWOFACodeModal
        isOpen={open2FA}
        onOpenChange={setOpen2FA}
        mode={transferMode}
        tokenSymbol={tokenSymbol}
      />
    </>
  )
}
