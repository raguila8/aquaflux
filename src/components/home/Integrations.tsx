import Image from 'next/image'
import clsx from 'clsx'
import { Divider } from '@/components/shared/Divider'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { StarField } from '@/components/shared/StarField'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import spaceSpotlight from '@/images/space-spotlight-2.png'

import bitget from '@/images/logos/icons/bitget.png'
import coinbase from '@/images/logos/icons/coinbase.png'
import metamask from '@/images/logos/icons/metamask.png'
import myetherwallet from '@/images/logos/icons/myetherwallet.png'
import phantum from '@/images/logos/icons/phantum.png'
import rabby from '@/images/logos/icons/rabby.png'
import safepal from '@/images/logos/icons/safe-pal.png'
import trustwallet from '@/images/logos/icons/trust-wallet.png'
import zerion from '@/images/logos/icons/zerion.png'

const integrations = [
  [
    { name: 'Bitget', image: bitget },
    { name: 'Coinbase', image: coinbase },
    { name: 'Metamask', image: metamask },
  ],
  [
    { name: 'Phantom', image: phantum },
    { name: 'Rabby', image: rabby },
    { name: 'SafePal', image: safepal },
  ],
  [
    { name: 'Trust Wallet', image: trustwallet },
    { name: 'Zerion', image: zerion },
    { name: 'MyEtherWallet', image: myetherwallet },
  ],
]

export function Integrations() {
  return (
    <section className='overflow-hidden bg-[linear-gradient(rgba(9,9,11,0.75),rgba(9,9,11,0.75)),linear-gradient(#07344550,#07344550)]'>
      <Container className='relative'>
        <div className='mx-auto w-full max-w-xl md:mx-0 md:grid md:max-w-none md:grid-cols-11'>
          <div className='flex items-center py-14 sm:py-20 md:col-span-5 md:py-32 lg:col-span-5 lg:py-40'>
            <div className='relative z-10 flex flex-col'>
              <h1 className='leading-extratight sm:leading-extratight text-indigo-blue-100 text-4xl font-bold tracking-wide sm:text-[2.75rem] lg:text-5xl lg:leading-tight'>
                Connect your favorite wallet today
              </h1>

              <p className='mt-6 text-lg leading-8 text-slate-300 md:text-[17px] md:leading-8 lg:text-lg lg:leading-8'>
                Choose any brand of cold or hot wallet that has access to the
                Arbitrium network (ARB). Simply click connect wallet and scan
                the QR code to connect and interact with our dashboard today!
              </p>
            </div>
          </div>
          <div className='relative md:col-span-6 md:pl-12 xl:pl-36'>
            <div className='relative flex h-96 items-center justify-center sm:h-[500px] md:h-full lg:items-start'>
              <div className='absolute -right-96 -bottom-12 -left-96'>
                <Image
                  src={spaceSpotlight}
                  alt=''
                  className='h-full w-full object-contain'
                />
              </div>

              {/* Stars */}
              <div
                className='absolute right-0 bottom-0 left-0 h-36 sm:-right-6 sm:-left-6 lg:-right-12 lg:-left-12'
                aria-hidden='true'
              >
                <StarField density='high' maxRadius={2.5} minRadius={1.25} />
              </div>
              <div className='z-10 lg:mt-16'>
                <div className='flex w-full space-x-7 sm:space-x-12 md:space-x-7 lg:space-x-12'>
                  {integrations.map((col, colIndex) => (
                    <div
                      key={`integrations-col-${colIndex}`}
                      className={clsx(
                        'relative flex flex-col space-y-6 sm:space-y-8 md:space-y-6 lg:space-y-8',
                        (colIndex + 1) % 2 !== 0 &&
                          'translate-y-14 md:translate-y-12 lg:translate-y-20'
                      )}
                    >
                      {col.map((integration) => (
                        <div
                          key={`integrations-${integration.name}`}
                          className='h-24 w-24 rounded-2xl bg-zinc-700/15 shadow-[inset_0_-8px_50px_50px_rgba(27,36,80,0.05),_0_1px_0_0_rgba(0,0,0,0.2),_0_4px_25px_1px_rgba(3,201,230,0.1)] sm:h-32 sm:w-32 md:h-24 md:w-24 lg:h-32 lg:w-32'
                        >
                          <div className='border-indigo-blue-200/[.06] flex h-full w-full items-center justify-center rounded-2xl border'>
                            <Image
                              src={integration.image}
                              alt={integration.name}
                              className='h-9 w-9 sm:h-12 sm:w-12 md:h-9 md:w-9 lg:h-12 lg:w-12'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Divider />
    </section>
  )
}
