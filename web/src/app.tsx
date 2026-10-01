import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { Toaster } from '@/components/ui/toaster'
import { queryClient } from '@/lib/query-client'
import { AppRoutes } from '@/routes'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
