import type { Icon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary: cn(
    'h-12 w-full gap-3 rounded-lg bg-blue-base px-5 font-semibold text-md text-white',
    'enabled:hover:bg-blue-dark',
    'focus-visible:outline-[1.5px] focus-visible:outline-blue-base focus-visible:outline-offset-2',
  ),
  secondary: cn(
    'h-8 gap-1.5 rounded-sm bg-gray-200 px-2 font-semibold text-gray-500 text-sm',
    'enabled:hover:inset-ring-1 enabled:hover:inset-ring-blue-base',
    'focus-visible:inset-ring-1 focus-visible:inset-ring-blue-base focus-visible:outline-none',
  ),
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof variants
  icon?: Icon
}

export function Button({
  variant = 'primary',
  icon: IconComponent,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {IconComponent && (
        // The design only defines an icon on the secondary variant (gray-600); otherwise it follows the text.
        <IconComponent
          size={16}
          className={cn('shrink-0', variant === 'secondary' && 'text-gray-600')}
        />
      )}
      {children}
    </button>
  )
}
