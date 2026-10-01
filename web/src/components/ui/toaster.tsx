import { InfoIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'
import { getToasts, subscribeToToasts, type ToastMessage, type ToastVariant } from '@/lib/toast'

// The tinted backgrounds are derived from the design tokens (10% of the variant color over white).
const variants = {
  info: {
    icon: InfoIcon,
    role: 'status',
    className:
      'bg-[color-mix(in_srgb,var(--color-blue-base)_10%,var(--color-white))] text-blue-base',
  },
  error: {
    icon: WarningCircleIcon,
    role: 'alert',
    className: 'bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-white))] text-danger',
  },
} satisfies Record<ToastVariant, unknown>

export function Toast({ variant, title, description }: Omit<ToastMessage, 'id'>) {
  const { icon: IconComponent, role, className } = variants[variant]

  return (
    <div role={role} className={cn('flex items-center gap-3 rounded-lg p-4 shadow-md', className)}>
      <IconComponent size={16} weight="fill" aria-hidden className="shrink-0" />
      <div className="flex min-w-0 flex-col">
        <strong className="font-semibold text-md">{title}</strong>
        <span className="text-sm">{description}</span>
      </div>
    </div>
  )
}

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToToasts, getToasts)

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-10 flex flex-col gap-3 lg:inset-x-auto lg:right-5 lg:bottom-5 lg:w-[380px]">
      {toasts.map((item) => (
        <Toast
          key={item.id}
          variant={item.variant}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  )
}
