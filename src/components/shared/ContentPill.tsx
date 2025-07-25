import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/utils'

type ContentPillProps = {
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  text: string
  className?: string
  innerClassName?: string
  iconClassName?: string
  textClassName?: string
}

export function ContentPill({
  Icon,
  text,
  className,
  innerClassName,
  iconClassName,
  textClassName,
}: ContentPillProps) {
  return (
    <div
      className={cn(
        'shadow-inner-blur inline-flex w-max rounded-full bg-zinc-950/[.01]',
        className
      )}
    >
      <div
        className={cn(
          'border-indigo-blue-200/[.06] flex h-full w-full items-center space-x-2 rounded-full border px-4 py-1.5',
          innerClassName
        )}
      >
        {Icon && (
          <Icon className={cn('text-indigo-blue-200 size-4', iconClassName)} />
        )}

        <span
          className={cn(
            'text-indigo-blue-100 text-sm font-medium drop-shadow-[-12px_-4px_6px_rgba(236,254,255,0.2)]',
            textClassName
          )}
        >
          {text}
        </span>
      </div>
    </div>
  )
}
