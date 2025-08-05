import { twMerge } from 'tailwind-merge'
import { clsx, ClassValue } from 'clsx'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export function getOffsetTop(element: HTMLElement | null) {
  let offsetTop = 0
  while (element) {
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return offsetTop
}

export const truncateHash = (hash: string, maxLength: number = 14): string => {
  if (hash.length <= maxLength) {
    return hash
  }

  const firstPart = hash.slice(0, 7)
  const lastPart = hash.slice(-7)
  return `${firstPart}...${lastPart}`
}
