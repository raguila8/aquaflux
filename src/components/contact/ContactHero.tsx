import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { ContainerOutline } from '@/components/shared/ContainerOutline'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContentPill } from '@/components/shared/ContentPill'
import { CLIENTS } from '@/config'

import spaceSpotlight from '@/images/space-spotlight.png'
import SendIcon from '@/icons/nucleo/send-16.svg'
import CCheckIcon from '@/icons/nucleo/c-check-16.svg'

const contactReasons = [
  'Secure an appointment to talk to our sales reps.',
  'Learn which plan is right for your team.',
  'Request a demo or get onboarding help.',
]

export function ContactHero() {
  return (
    <Container className='relative py-20 lg:pb-48 lg:pt-28'>
      <div className='absolute -bottom-48 -left-56 -right-56 h-full sm:-left-48 sm:-right-48 sm:top-64 md:left-1/2 md:w-full md:max-w-6xl md:-translate-x-1/2 lg:top-16'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain opacity-40 lg:opacity-50'
          sizes='(max-width: 768px) 100vw, 1152px'
          priority
        />
      </div>

      <div className='relative mx-auto max-w-lg sm:max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-x-12 2xl:gap-x-28'>
        {/* Text content */}
        <div
          id='about-text-header'
          className='flex w-full flex-col md:items-center lg:col-span-1 lg:items-start'
        >
          <div>
            <ContentPill
              Icon={SendIcon}
              iconClassName='h-3.5 w-3.5'
              text='Contact us'
            />
          </div>
          <h1 className='mt-5 text-[2.75rem] font-bold leading-[1.125] text-violet-100 sm:text-5xl sm:leading-[1.125] md:text-center md:leading-[1.125] lg:text-left xl:text-6xl 2xl:text-[64px]'>
            Get in touch
          </h1>
          <p className='mt-5 text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-8 md:mx-auto md:max-w-xl md:text-center lg:mx-0 lg:max-w-none lg:text-left'>
            Please feel free to send us any questions, feedback or suggestions
            you might have.
          </p>
          <ul className='mt-6 flex flex-col space-y-4 md:mt-10 md:max-w-3xl md:flex-row md:space-x-3 md:space-y-0 lg:mt-12 lg:flex-col lg:space-x-0 lg:space-y-4'>
            {contactReasons.map((reason, i) => (
              <li
                key={`contact-reason-${i}`}
                className='flex items-start sm:items-center md:items-start lg:items-center'
              >
                <CCheckIcon className='mt-1.5 h-4 w-4 shrink-0 text-violet-100 sm:mt-0 md:mt-1.5 lg:mt-0 lg:h-4.5 lg:w-4.5' />
                <p className='ml-3 text-lg text-zinc-300 md:text-[17px] md:leading-normal lg:ml-4'>
                  {reason}
                </p>
              </li>
            ))}
          </ul>

          {/* Social Proof */}
          <div className='w-full'>
            <div className='mt-14 flex items-center gap-x-4 sm:mt-16 xl:mt-20'>
              <h4 className='flex-none text-sm font-semibold uppercase leading-6 tracking-wider text-zinc-400/95'>
                Our clients
              </h4>
              <div className='h-px flex-auto bg-linear-to-r from-violet-200/[0.08] to-violet-200/[0.20]'></div>
            </div>
            <div className='relative mt-6 w-full overflow-hidden [mask:linear-gradient(90deg,_transparent,_white_20%,_white_80%,_transparent)]'>
              <div className='flex w-max animate-infiniteScroll items-center justify-around'>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`contact-clients-${i}`}
                    className='flex w-1/2 items-center'
                  >
                    {CLIENTS.map((client) => (
                      <client.logo
                        key={`contact-clients-${i}-${client.name}`}
                        className='mx-0.5 scale-75 sm:mx-3 sm:scale-90'
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='mt-16 sm:mt-20 lg:col-span-1 lg:mt-0'>
          <div className='relative z-10 px-6 py-10 shadow-inner-blur sm:px-8'>
            <ContainerOutline />
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  )
}
