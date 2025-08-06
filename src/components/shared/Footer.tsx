import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { FooterCTA } from '@/components/shared/FooterCTA'
import { StarField } from '@/components/shared/StarField'
import { ContentPill } from '@/components/shared/ContentPill'
import { SOCIALS } from '@/config'

const logo = 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/aquaflux-logo.avif'
const logoIcon = 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/aquaflux-logo-icon.avif'

type Props = {
  cta?: boolean
}

type NavigationLink = {
  name: string
  href: string
  new?: boolean
}

type NavigationSection = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  links: NavigationLink[]
}

type Navigation = NavigationSection[]

const navigation: Navigation = []

export function Footer({ cta = true }: Props) {
  const hasNavigation = navigation && navigation.length > 0

  return (
    <section className={clsx({ 'overflow-hidden': cta })}>
      <div className='relative'>
        {cta && <FooterCTA />}

        {/* Stars */}
        <div
          className='absolute -bottom-4 left-1/2 -z-10 h-48 w-full max-w-3xl -translate-x-1/2 md:-bottom-8 md:h-64 lg:-bottom-12'
          aria-hidden='true'
        >
          <StarField density='medium' maxRadius={2.5} />
        </div>
      </div>
      <div className='relative top-2 left-1/2 w-[350%] -translate-x-1/2 rounded-t-[100%] bg-linear-to-r from-transparent via-violet-100/15 to-transparent p-[0.5px] sm:w-[250%] md:top-4 md:w-[200%] lg:top-10 lg:w-[150%] xl:w-[125%]'>
        <div
          className={clsx(
            'h-full w-full rounded-t-[100%] bg-[linear-gradient(rgba(9,9,11,0.8),rgba(9,9,11,0.9)),linear-gradient(#073445,#073445)] pb-16 sm:pb-18',
            hasNavigation ? 'pt-24 sm:pt-28 md:pt-32 lg:pt-40' : 'pt-4'
          )}
        >
          <div className='mx-auto w-screen'>
            <div className='mx-auto max-w-lg px-5 sm:max-w-xl sm:px-6 md:max-w-3xl lg:max-w-(--breakpoint-xl) lg:px-8'>
              {hasNavigation && (
                <div className='grid grid-cols-2 gap-12 sm:grid-cols-2 sm:gap-16 md:grid-cols-3 lg:grid-cols-5 lg:gap-8'>
                  {navigation.map((navCol, navColIndex) => (
                    <div
                      key={`footer-navCol-${navColIndex}`}
                      className='flex lg:justify-center'
                    >
                      <div className='flex flex-col'>
                        <div className='flex items-center'>
                          <navCol.icon className='h-5 w-5' />
                          <h4 className='ml-4 flex flex-col align-middle text-sm font-semibold text-zinc-400'>
                            {navCol.label}
                          </h4>
                        </div>
                        <div className='mt-6 flex items-start'>
                          <div className='relative flex h-full w-5 justify-center'>
                            <div className='absolute -inset-y-2 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-violet-200/[0.12] to-violet-200/[0.04]' />
                          </div>
                          <ul className='ml-4 space-y-5'>
                            {navCol.links?.map((link, i) => (
                              <li
                                key={`footer-nav-item-${navColIndex}-${i}`}
                                className='group relative flex items-center'
                              >
                                <Link
                                  href={link.href}
                                  className='text-sm leading-none font-semibold text-violet-50 hover:text-violet-400/95'
                                >
                                  {link.name}
                                </Link>
                                {link.new && (
                                  <ContentPill
                                    className='ml-3'
                                    text='New'
                                    innerClassName='px-2 py-0.5'
                                    textClassName='text-xs text-violet-200'
                                  />
                                )}
                                <span className='absolute -inset-y-1.5 -left-[26.5px] w-px bg-linear-to-b from-violet-400/0 via-violet-400/90 to-violet-400/0 opacity-0 duration-200 ease-in-out group-hover:opacity-100' />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className='shadow-inner-blur mt-16 block w-full rounded-2xl bg-zinc-950/[.01] sm:mt-24'>
                <div className='flex w-full items-center justify-between space-x-5 rounded-2xl border border-violet-200/[.06] px-6 py-4 sm:space-x-8 sm:px-8 sm:py-6'>
                  {/* Logo */}
                  <div className='flex shrink-0 items-center'>
                    <Link
                      href='/'
                      aria-label='Home'
                      className='flex shrink-0 items-center'
                    >
                      <Image
                        src={logo}
                        alt=''
                        className='h-6 w-auto sm:inline sm:h-7 xl:h-8'
                      />
                      <Image
                        src={logoIcon}
                        alt=''
                        className='hidden h-8 w-auto'
                      />
                    </Link>
                  </div>
                  <div className='flex items-center space-x-5 sm:space-x-7 lg:space-x-6 xl:space-x-12'>
                    {SOCIALS.map((social) => (
                      <a
                        key={`footer-social-${social.name}`}
                        href={social.href}
                        aria-label={social.ariaLabel}
                        target={social.name === 'telegram' ? '_blank' : undefined}
                        rel={social.name === 'telegram' ? 'noopener noreferrer' : undefined}
                        className='group text-indigo-blue-50/90 flex items-center space-x-2 text-sm font-semibold drop-shadow-[-2px_-4px_6px_rgba(221,232,252,0.2)]'
                        style={{
                          display: (social.name === 'twitter' || social.name === 'discord') ? 'none' : 'flex'
                        }}
                      >
                        <social.icon className='group-hover:text-indigo-blue-200/85 h-4 w-4 duration-200 ease-in-out' />
                        <span className='group-hover:text-indigo-blue-300/95 hidden duration-200 ease-in-out lg:inline'>
                          {social.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <p className='mt-10 text-center text-[15px] text-slate-400/95 sm:mt-12'>
                © {new Date().getFullYear()} Aquaflux, Inc. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
