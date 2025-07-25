import Link from 'next/link'
import { FormHeader } from '@/components/auth/FormHeader'
import { Container } from '@/components/shared/Container'
import { ContainerOutline } from '@/components/shared/ContainerOutline'
import { Button } from '@/components/shared/Button'
import { TextField } from '@/components/forms/TextField'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export const metadata = {
  title: 'Sign in',
  description:
    'Access your Nebula account by signing in. Enjoy seamless remote work collaboration and tools.',
}

export default function Signin() {
  return (
    <Container className='max-w-lg py-5'>
      <div className='relative z-10 flex flex-col shadow-inner-blur'>
        <ContainerOutline />
        <FormHeader
          title='Welcome back'
          description='Fill in the details below to sign in.'
        />
        <div className='mt-8 flex w-full items-center px-10'>
          <div className='h-px flex-1 bg-linear-to-r from-violet-200/5 to-violet-200/10'></div>
          <h4 className='shrink-0 px-4 text-xs text-violet-100/75'>
            or sign in with
          </h4>
          <div className='h-px flex-1 bg-linear-to-r from-violet-200/10 to-violet-200/5'></div>
        </div>
        <form action='#' method='POST' className='mt-9 px-6 pb-10 sm:px-10'>
          <div className='space-y-8'>
            <TextField
              label='Email'
              name='email'
              type='email'
              auto-complete='email'
              placeholder='johnnybravo@gmail.com'
              required
            />

            <TextField
              name='password'
              type='password'
              label='Password'
              link={{ href: '/password-reset', text: 'Forgot password?' }}
              autoComplete='current-password'
              placeholder='Password (min. 6 characters)'
              required
            />
          </div>

          <div className='mt-10 flex items-center justify-between space-x-4 sm:mt-12'>
            <p className='text-sm text-violet-100/75'>
              Don’t have an account?{' '}
              <Link
                className='text-violet-300/80 underline duration-200 ease-in-out hover:text-violet-300'
                href='/signup'
              >
                Sign up
              </Link>
            </p>
            <Button type='submit' className='sm:px-5'>
              <span>Sign in</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
