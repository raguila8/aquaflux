import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  [key: string]: any
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  loading = 'lazy',
  ...props 
}: OptimizedImageProps) => {
  const [error, setError] = useState(false)

  // Fallback for broken images
  if (error) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width: width || 'auto', height: height || 'auto' }}
        {...props}
      >
        <span className="text-xs text-gray-500">{alt}</span>
      </div>
    )
  }

  // Use Next.js Image for external URLs (Vercel Blob) and img for others
  if (src.startsWith('http') || src.includes('vercel-storage.com')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 32}
        height={height || 32}
        priority={priority}
        loading={loading}
        className={className}
        onError={() => setError(true)}
        {...props}
      />
    )
  }

  // For local/imported images, use regular img tag (avoiding Next.js optimization issues)
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  )
}