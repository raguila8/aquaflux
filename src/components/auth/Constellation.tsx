'use client'

import { StarField } from '@/components/shared/StarField'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Constellation() {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'absolute -left-8 bottom-0 -z-10 h-96 w-44 rotate-[-25deg] sm:bottom-8 sm:left-20 lg:bottom-[unset] lg:left-[unset] lg:right-48 lg:h-[550px]',
        pathname !== '/signup' && 'hidden xl:block'
      )}
      aria-hidden='true'
    >
      <StarField density='high' maxRadius={2.25} />
    </div>
  )
}
