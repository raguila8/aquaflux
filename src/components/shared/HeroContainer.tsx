import Image from 'next/image'
import { Header } from '@/components/header/Header'
import { StarField } from '@/components/shared/StarField'
import { cn } from '@/lib/utils'
const spaceWavesPng = 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/hero-space-waves.avif'

interface HeroContainerProps {
  starField?: boolean
  header?: boolean
  bgGradientClassName?: string
  innerContainerClassName?: string
  className?: string
  children?: React.ReactNode
}

export const HeroContainer = ({
  starField = true,
  header = true,
  bgGradientClassName = '',
  innerContainerClassName = '',
  className,
  children,
}: HeroContainerProps) => {
  return (
    <section className={cn('relative', className)}>
      {header && <Header />}

      <div className={cn('overflow-hidden', innerContainerClassName)}>
        <Image
          src={spaceWavesPng}
          alt=''
          className={cn(
            'absolute inset-x-0 -top-64 -z-20 size-full object-cover',
            bgGradientClassName
          )}
          sizes='100vw'
          priority
        />

        {starField && (
          <div className='absolute inset-0 -z-10' aria-hidden='true'>
            <StarField />
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
