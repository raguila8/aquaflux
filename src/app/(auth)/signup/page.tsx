import Link from 'next/link'
import { TestimonialSlider } from '@/components/auth/TestimonialSlider'
import { FormHeader } from '@/components/auth/FormHeader'
import { Container } from '@/components/shared/Container'
import { ContainerOutline } from '@/components/shared/ContainerOutline'
import { Button } from '@/components/shared/Button'
import { TextField } from '@/components/forms/TextField'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export const metadata = {
  title: 'Sign up',
  description:
    'Create your Nebula account today and unlock seamless remote work solutions and team collaboration.',
}

export default function Signup() {
  return (
    <Container className='max-w-lg py-5 sm:max-w-xl lg:max-w-6xl'>
      <div className='lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-36'>
        <div className='shadow-inner-blur relative z-10 flex flex-col'>
          <ContainerOutline />

          <FormHeader
            title='Welcome to Nebula'
            description='Fill in the details to get started.'
          />

          <div className='mt-8 flex w-full items-center px-10'>
            <div className='from-indigo-blue-200/5 to-indigo-blue-200/10 h-px flex-1 bg-linear-to-r'></div>
            <h4 className='text-indigo-blue-100/75 shrink-0 px-4 text-xs'>
              or sign up with
            </h4>
            <div className='h-px flex-1 bg-linear-to-r from-violet-200/10 to-violet-200/5'></div>
          </div>
          <form action='#' method='POST' className='mt-9 px-6 pb-10 sm:px-10'>
            <div className='space-y-8'>
              <div className='space-y-8 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-x-6'>
                <TextField
                  label='First name'
                  name='first-name'
                  autoComplete='given-name'
                  placeholder='Johnny'
                  required
                />
                <TextField
                  label='Last name'
                  name='last-name'
                  autoComplete='family-name'
                  placeholder='Bravo'
                  required
                />
              </div>

              <TextField
                label='Email'
                name='email'
                type='email'
                autoComplete='email'
                placeholder='johnnybravo@gmail.com'
                required
              />

              <TextField
                name='password'
                type='password'
                label='Password'
                autoComplete='current-password'
                placeholder='Password (min. 6 characters)'
                required
              />
            </div>

            <div className='mt-10 flex items-center justify-between space-x-4'>
              <p className='text-indigo-blue-100/75 text-sm'>
                Already have an account?{' '}
                <Link
                  className='text-aqua-300/80 hover:text-aqua-300 underline duration-200 ease-in-out'
                  href='/signin'
                >
                  Sign in
                </Link>
              </p>
              <Button type='submit' className='sm:px-5'>
                <span>Continue</span>
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </form>
        </div>
        <TestimonialSlider />
      </div>
    </Container>
  )
}
