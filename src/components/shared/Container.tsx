import { cn } from '@/lib/utils'
type ContainerProps = React.HTMLAttributes<HTMLDivElement>

export function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto max-w-(--breakpoint-xl) px-5 sm:px-6 lg:px-8', className)}
    >
      {children}
    </div>
  )
}
