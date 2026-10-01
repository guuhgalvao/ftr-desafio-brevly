import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'

// Single card shared by the redirect and not found pages.
// As in the design, it sits slightly above the vertical center: 40px on mobile and 17.5px on desktop.
export function MessageCard(props: Omit<ComponentProps<typeof Card>, 'className'>) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 pt-8 pb-28 lg:pb-[67px]">
      <Card
        className="w-full items-center gap-6 px-5 py-12 text-center lg:w-[580px] lg:px-12 lg:py-16"
        {...props}
      />
    </main>
  )
}
