import type { Icon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  icon: Icon
  'aria-label': string
}

export function IconButton({
  icon: IconComponent,
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-gray-200 text-gray-600 transition-colors',
        'enabled:hover:inset-ring-1 enabled:hover:inset-ring-blue-base',
        'focus-visible:inset-ring-1 focus-visible:inset-ring-blue-base focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <IconComponent size={16} />
    </button>
  )
}
