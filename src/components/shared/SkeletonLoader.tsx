import { cx } from '@/utils/cx'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton = ({ className, children, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx("animate-pulse rounded-md bg-zinc-800/50", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const MetricSkeleton = () => {
  return (
    <div className="shadow-inner-blur ring-secondary relative rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset p-5 lg:p-6 flex-1 lg:min-w-[320px]">
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-24" />
        
        {/* Main value skeleton */}
        <div className="flex items-end justify-between gap-4">
          <Skeleton className="h-12 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        
        {/* Subtitle skeleton */}
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

export const ChartSkeleton = () => {
  return (
    <div className="shadow-inner-blur ring-secondary relative rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset p-5 lg:p-6">
      <div className="flex flex-col gap-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
          </div>
        </div>
        
        {/* Chart area skeleton */}
        <div className="h-80 relative">
          <Skeleton className="h-full w-full">
            {/* Simulate chart lines */}
            <div className="absolute inset-4 flex items-end justify-between">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-1 bg-zinc-700/50" 
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export const TableSkeleton = () => {
  return (
    <div className="shadow-inner-blur ring-secondary relative rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset p-5 lg:p-6">
      <div className="flex flex-col gap-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        
        {/* Table header skeleton */}
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-zinc-800/50">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
        
        {/* Table rows skeleton */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-18" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}