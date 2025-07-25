import Link from 'next/link'
import { FormHeader } from '@/components/auth/FormHeader'
import { Container } from '@/components/shared/Container'
import { ContainerOutline } from '@/components/shared/ContainerOutline'
import { Button } from '@/components/shared/Button'
import { TextField } from '@/components/forms/TextField'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export const metadata = {
  title: 'Password Reset',
  description:
    'Need to reset your password? Follow the steps here to regain access to your Nebula account and resources.',
}

export default function PasswordReset() {
  return (
    <Container className='max-w-lg py-5 sm:max-w-xl'>
      <div className='relative z-10 flex flex-col shadow-inner-blur'>
        <ContainerOutline />
        <FormHeader
          title='Reset your password'
          description='Enter your email below and we will send you an email with instruction to reset your password.'
          socialButtons={false}
        />

        <form action='#' method='POST' className='mt-8 px-6 pb-10 sm:px-10'>
          <div className='space-y-8'>
            <TextField
              label='Email'
              name='email'
              type='email'
              autoComplete='email'
              placeholder='johnnybravo@gmail.com'
              required
            />
          </div>

          <div className='mt-10 flex items-center justify-between space-x-4'>
            <p className='text-sm text-violet-100/75'>
              Know your password?{' '}
              <Link
                className='text-violet-300/80 underline duration-200 ease-in-out hover:text-violet-300'
                href='/signin'
              >
                Sign in
              </Link>
            </p>
            <Button type='submit' className='sm:px-5'>
              <span>Reset password</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
