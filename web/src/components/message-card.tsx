import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'

// Single centered card shared by the redirect and not found pages.
export function MessageCard(props: Omit<ComponentProps<typeof Card>, 'className'>) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 py-8">
      <Card
        className="w-full items-center gap-6 px-5 py-12 text-center lg:w-[580px] lg:px-12 lg:py-16"
        {...props}
      />
    </main>
  )
}
