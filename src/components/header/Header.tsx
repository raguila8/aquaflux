import Link from 'next/link'
import Image from 'next/image'
import { NavbarPill } from '@/components/header/NavbarPill'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'

import logo from '@/images/aquaflux-logo.png'

export const Header = () => {
  return (
    <header className='relative h-20'>
      <Container className='flex h-full items-center'>
        <nav className='relative z-50 flex w-full items-center justify-between'>
          {/* Logo */}
          <div className='relative z-10 hidden shrink-0 items-center md:flex'>
            <Link
              href='/'
              aria-label='Home'
              className='flex shrink-0 items-center'
            >
              <Image src={logo} alt='' className='h-7 w-auto lg:h-8' />
            </Link>
          </div>

          <NavbarPill />

          <div className='hidden items-center md:flex lg:space-x-3 xl:space-x-4'>
            <Button
              href='/signin'
              variant='tertiary'
              size='md'
              className='overflow-hidden'
            >
              Sign in
            </Button>

            {/* Call to action */}
            <Button href='/signup' size='md'>
              Sign up
            </Button>
          </div>
        </nav>
        <hr className='absolute inset-x-0 bottom-0 h-px border-0 bg-linear-to-r from-transparent via-violet-200/15 to-transparent' />
      </Container>
    </header>
  )
}
