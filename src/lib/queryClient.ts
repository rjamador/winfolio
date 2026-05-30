import { QueryClient } from '@tanstack/react-query'

/**
 * Single configured QueryClient for the app. Portfolio data rarely changes, so
 * staleness is generous and refetch-on-focus is off.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 30, // 30 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
