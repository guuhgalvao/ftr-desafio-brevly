import { CircleNotchIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

interface SpinnerProps {
  size?: number
  className?: string
}

// Decorative: the loading state is announced by the text or `aria-busy` next to it.
export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <CircleNotchIcon size={size} aria-hidden className={cn('shrink-0 animate-spin', className)} />
  )
}
