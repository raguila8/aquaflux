import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import logo from '@/images/aquaflux-logo-icon.png'
import GoogleIcon from '@/icons/nucleo/google.svg'
import GithubIcon from '@/icons/nucleo/github.svg'

interface Props {
  title: string
  description: string
  socialButtons?: boolean
}

export function FormHeader({
  title,
  description,
  socialButtons = true,
}: Props) {
  return (
    <div className='flex flex-col items-center px-6 pt-10 sm:px-10'>
      <Link href='/' className='flex shrink-0' aria-label='Home'>
        <Image src={logo} className='h-auto w-12' alt='Logo' />
      </Link>
      <h1 className='mt-4 text-center text-3xl font-bold text-violet-100'>
        {title}
      </h1>
      <p className='mt-1.5 text-center text-base leading-relaxed text-zinc-300'>
        {description}
      </p>

      {socialButtons && (
        <div className='mt-8 flex w-full flex-col items-center gap-4 sm:flex-row'>
          <Button
            href='/'
            variant='secondary'
            size='md'
            className='w-full max-w-60 bg-zinc-700/25 leading-6 sm:w-1/2 sm:max-w-none'
            innerClassName='justify-between'
          >
            <div className='flex items-center'>
              <GoogleIcon className='mr-2 h-4 w-4' />
              Google
            </div>
            <ChevronRightIcon className='h-4 w-4 text-violet-100/75 duration-200 ease-in-out group-hover:text-violet-50/75' />
          </Button>
          <Button
            href='/'
            variant='secondary'
            size='md'
            className='w-full max-w-60 bg-zinc-700/25 leading-6 sm:w-1/2 sm:max-w-none'
            innerClassName='justify-between'
          >
            <div className='flex items-center space-x-2'>
              <GithubIcon className='mr-2 h-4 w-4' />
              Github
            </div>
            <ChevronRightIcon className='h-4 w-4 text-violet-100/75 duration-200 ease-in-out group-hover:text-violet-50/75' />
          </Button>
        </div>
      )}
    </div>
  )
}
