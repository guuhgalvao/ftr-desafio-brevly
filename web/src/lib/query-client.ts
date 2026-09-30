import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'

const MAX_QUERY_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx answers are final (e.g. 404 on an unknown short URL); retry only network and 5xx errors.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) {
          return false
        }
        return failureCount < MAX_QUERY_RETRIES
      },
    },
    mutations: {
      retry: false,
    },
  },
})
