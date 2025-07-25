'use client'
import { Stars } from '@/lib/starfield'
import { useEffect, useRef } from 'react'

interface StarFieldProps {
  maxRadius?: number
  minRadius?: number
  density?: 'low' | 'medium' | 'high'
}

export const StarField = ({
  maxRadius = 3,
  minRadius = 1,
  density = 'low',
}: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const starfield = new Stars(
      canvasRef.current,
      maxRadius,
      minRadius,
      density
    )
    return () => {
      starfield.destroy()
    }
  }, [density, maxRadius, minRadius])

  return (
    <canvas
      ref={canvasRef}
      className='opacity-0 duration-1000 ease-in-out'
    ></canvas>
  )
}
