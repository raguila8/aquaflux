import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { ContentPill } from '@/components/shared/ContentPill'
import { StarField } from '@/components/shared/StarField'
import { cn } from '@/lib/utils'

import spaceSpotlight from '@/images/space-spotlight.png'
import cosmicButterfly from '@/images/cosmic-butterfly.png'
import CommentsIcon from '@/icons/nucleo/comments-16.svg'

const faqs = [
  {
    question: 'What payment methods does Nebula accept?',
    answer:
      'Nebula accepts a variety of payment methods including major credit and debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. We also support payments via digital wallets such as Apple Pay and Google Pay.',
  },
  {
    question: 'Can I change my plan later on?',
    answer:
      'Yes, you can change your plan at any time. Simply go to your account settings and select the "Change Plan" option. You can upgrade or downgrade your plan as needed. Any changes will be prorated based on your billing cycle.',
  },
  {
    question: 'Does Nebula offer any discounts for nonprofits?',
    answer:
      'Yes, Nebula offers special discounts for nonprofit organizations. To apply for a nonprofit discount, please contact our support team with proof of your nonprofit status, and we will provide you with a discount code to use during checkout.',
  },
  {
    question: 'Can I get a refund if I don’t like Nebula?',
    answer:
      'Yes, we offer a 30-day money-back guarantee. If you are not satisfied with Nebula, you can request a refund within 30 days of your purchase. Please contact our support team to initiate the refund process.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes, we offer a 14-day free trial for all our plans. You can sign up for the free trial without providing payment information. If you decide to continue using Nebula after the trial period, you will need to select a plan and provide payment details.',
  },
  {
    question: 'How does Nebula handle data privacy and security?',
    answer:
      'Nebula takes data privacy and security very seriously. We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. We are also compliant with GDPR and other data protection regulations.',
  },
]

export function Faq() {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute -left-56 -right-56 -top-80 sm:-left-48 sm:-right-48 md:left-1/2 md:w-full md:max-w-6xl md:-translate-x-1/2 lg:-top-96'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain opacity-45'
          sizes='(max-width: 768px) 100vw, 1152px'
        />
      </div>

      {/* Stars */}
      <div
        className='absolute left-1/2 top-0 -z-10 h-48 w-full max-w-2xl -translate-x-1/2'
        aria-hidden='true'
      >
        <StarField density='medium' maxRadius={2.5} minRadius={1.25} />
      </div>

      <Container className='relative max-w-2xl gap-16 pb-12 pt-20 sm:pb-14 md:max-w-(--breakpoint-xl) lg:pb-16 lg:pt-24'>
        <div className='absolute -left-96 -right-96 -top-96 bottom-0 -z-10'>
          <Image
            src={cosmicButterfly}
            alt=''
            className='h-[calc(100%_+_384px)] w-[calc(100%_+_768px)] opacity-10'
            sizes='(max-width: 1024px) 100vw, 1024px'
          />
        </div>

        {/* Text content */}
        <div className='flex flex-col items-center'>
          <ContentPill
            Icon={CommentsIcon}
            text='FAQs'
            iconClassName='h-3.5 w-3.5'
          />
          <h1 className='mt-5 max-w-5xl text-center text-4xl font-bold leading-extratight text-violet-100 sm:mt-6 sm:text-5xl sm:leading-extratight'>
            Frequently asked questions
          </h1>
          <p className='mt-5 max-w-2xl text-center text-[17px] leading-8 text-zinc-200 sm:text-lg sm:leading-8'>
            Haven’t found what you’re looking for? Try Nebula’s wiki or{' '}
            <Link
              href='/contact'
              className='font-medium text-violet-300 underline duration-200 ease-in-out hover:text-violet-400'
            >
              contact us.
            </Link>
          </p>
        </div>

        {/* Faqs */}
        <div className='relative mt-8 flex flex-wrap items-stretch justify-center'>
          {faqs.map((faq, index) => (
            <div
              key={`faqs-${index}`}
              className="group relative w-full bg-linear-to-b after:absolute after:content-[''] md:w-1/2"
            >
              {/* left borders */}
              <div
                className={cn(
                  'absolute inset-y-0 left-0 h-full w-px bg-linear-to-b',
                  index % 2 === 0
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.025] to-violet-200/[0.1]'
                      : 'from-violet-200/[0.05] to-violet-200/[0.1] md:from-violet-200/[0.1] md:to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.05]'
                      : 'from-violet-200/[0.1] to-violet-200/[0.025] md:from-violet-200/[0.05] md:to-violet-200/[0.1]'
                )}
              />
              {/* bottom borders */}
              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 h-px w-full bg-linear-to-r',
                  Math.ceil(faqs.length / 2) === Math.floor(index / 2) + 1 &&
                    'md:hidden',
                  faqs.length === index + 1 && 'hidden',
                  index % 2 === 0
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.025] to-violet-200/[0.1]'
                      : 'from-violet-200/[0.1] to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.025]'
                      : 'from-violet-200/[0.025] to-violet-200/[0.1]'
                )}
              />
              {/* Right borders */}
              <div
                className={cn(
                  'absolute inset-y-0 right-0 h-full w-px bg-linear-to-b',
                  index % 2 === 1
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.05] to-violet-200/[0.025] md:from-violet-200/[0.025] md:to-violet-200/[0.1]'
                      : 'from-violet-200/[0.05] to-violet-200/[0.1] md:from-violet-200/[0.1] md:to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.05] md:hidden'
                      : 'from-violet-200/[0.025] to-violet-200/[0.05] md:hidden'
                )}
              />

              <span className='absolute -left-[0.5px] top-1/2 h-8 w-px -translate-y-1/2 translate-x-1/2 bg-violet-100/25 md:bg-violet-100/40' />
              <div className='relative h-full w-full overflow-hidden'>
                <div
                  className='absolute bottom-1/2 left-1/2 right-0 top-0 opacity-0 duration-300 ease-in-out group-hover:opacity-100'
                  aria-hidden='true'
                >
                  <StarField density='high' maxRadius={1.75} minRadius={1} />
                </div>
                <div className='hover-gradient absolute inset-0 -z-10 bg-linear-to-b from-[#575EFF]/20 to-[#E478FF]/20 opacity-0 blur-4xl duration-300 ease-in-out group-hover:opacity-100' />
                <dl className='relative h-full w-full p-5 sm:px-6 sm:py-7 lg:p-12'>
                  <dt className='text-base font-bold leading-7 text-violet-50 sm:text-[17px] lg:text-lg'>
                    {faq.question}
                  </dt>
                  <dd className='mt-2 text-base leading-7 text-zinc-300 sm:mt-3 sm:text-[17px] lg:text-lg lg:leading-8'>
                    {faq.answer}
                  </dd>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
