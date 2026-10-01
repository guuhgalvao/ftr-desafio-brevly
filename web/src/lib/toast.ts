export type ToastVariant = 'info' | 'error'

export interface ToastMessage {
  id: number
  variant: ToastVariant
  title: string
  description: string
}

const TOAST_DURATION_MS = 4000

let toasts: ToastMessage[] = []
let nextId = 0
const listeners = new Set<() => void>()

function emit(next: ToastMessage[]) {
  toasts = next
  for (const listener of listeners) {
    listener()
  }
}

function show(variant: ToastVariant, title: string, description: string) {
  const id = nextId++
  emit([...toasts, { id, variant, title, description }])
  setTimeout(() => emit(toasts.filter((item) => item.id !== id)), TOAST_DURATION_MS)
}

// Minimal toast store, read by `<Toaster />` through `useSyncExternalStore`.
export const toast = {
  info: (title: string, description: string) => show('info', title, description),
  error: (title: string, description: string) => show('error', title, description),
}

export function subscribeToToasts(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToasts() {
  return toasts
}
