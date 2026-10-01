import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

// Padding and gap change per screen and breakpoint, so they come from `className`.
export function Card({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('flex flex-col rounded-lg bg-gray-100', className)} {...props} />
}
