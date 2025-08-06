import { cx } from '@/utils/cx'
import { Skeleton } from './SkeletonLoader'

export const PieChartSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cx(
        'shadow-inner-blur ring-secondary relative rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset',
        className
      )}
    >
      <div className='flex flex-col flex-wrap gap-6 p-5 lg:p-6'>
        <div className='flex flex-col flex-wrap gap-x-6 gap-y-6 min-[500px]:flex-row min-[500px]:items-center'>
          {/* Pie chart circle skeleton */}
          <div className='size-30 flex items-center justify-center'>
            <Skeleton className='size-full rounded-full'>
              <div className='absolute inset-4 bg-zinc-900 rounded-full'></div>
            </Skeleton>
          </div>
          
          <div className='flex w-full flex-1 flex-col gap-6 min-[500px]:w-auto'>
            {/* Title skeleton - hidden on lg */}
            <Skeleton className='h-5 w-32 hidden lg:block' />
            
            <div className='flex flex-col gap-2'>
              {/* Subtitle skeleton */}
              <Skeleton className='h-4 w-24' />
              
              <div className='flex items-end justify-between gap-4'>
                {/* Main value skeleton */}
                <Skeleton className='h-8 w-32' />
                
                {/* Trend indicator skeleton */}
                <div className='flex items-center gap-1 mb-0.5'>
                  <Skeleton className='h-3 w-3 rounded-sm' />
                  <Skeleton className='h-4 w-8' />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className='w-full px-0.5'>
          <hr className='h-px border-none bg-linear-to-r from-transparent via-violet-200/15 to-transparent' />
        </div>
        
        {/* Legend items skeleton */}
        <dl className='flex w-full flex-wrap items-center gap-6 min-[500px]:px-4 sm:gap-x-7'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className='flex gap-2' key={i}>
              <Skeleton className='mt-1 size-2 rounded-full' />
              <div className='flex flex-col gap-1'>
                <Skeleton className='h-3 w-16' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}