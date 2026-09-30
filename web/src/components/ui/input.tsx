import { WarningIcon } from '@phosphor-icons/react'
import { type ComponentProps, type MouseEvent, useId } from 'react'
import { cn } from '@/lib/cn'

type InputProps = ComponentProps<'input'> & {
  label: string
  error?: string
  // Fixed, non-editable text shown before the value (e.g. `brev.ly/`).
  prefix?: string
}

// Clicking anywhere in the field (including the prefix) focuses the input.
function focusInput(event: MouseEvent<HTMLDivElement>) {
  const input = event.currentTarget.querySelector('input')
  if (input && event.target !== input) {
    event.preventDefault()
    input.focus()
  }
}

export function Input({ label, error, prefix, id, placeholder, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hasError = Boolean(error)

  return (
    <div className={cn('group flex flex-col gap-2', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'text-xs uppercase transition-colors',
          hasError ? 'text-danger' : 'text-gray-500 group-focus-within:text-blue-base',
        )}
      >
        {label}
      </label>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: mouse-only convenience; the input itself is keyboard-focusable. */}
      <div
        onMouseDown={focusInput}
        className={cn(
          'flex h-12 cursor-text items-center rounded-lg bg-transparent px-4 text-md',
          hasError
            ? 'inset-ring-[1.5px] inset-ring-danger'
            : 'inset-ring-1 inset-ring-gray-300 focus-within:inset-ring-[1.5px] focus-within:inset-ring-blue-base',
        )}
      >
        {prefix && (
          <span className="shrink-0 select-none text-gray-600 group-has-[input:placeholder-shown]:text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          // `:placeholder-shown` drives the prefix color, so the prefixed input needs a placeholder.
          placeholder={placeholder ?? (prefix ? ' ' : undefined)}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-gray-600 caret-blue-base outline-none placeholder:text-gray-400"
          {...props}
        />
      </div>

      {hasError && (
        <p id={errorId} className="flex items-center gap-2 text-gray-500 text-sm">
          <WarningIcon size={16} className="shrink-0 text-danger" />
          {error}
        </p>
      )}
    </div>
  )
}
