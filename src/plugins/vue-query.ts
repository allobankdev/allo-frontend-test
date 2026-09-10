/**
 * plugins/vue-query.ts
 *
 * TanStack Query defaults. Rocket data is static reference data, so the
 * cache is long-lived and background refetching stays quiet.
 */

import { QueryClient } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { RocketApiError } from '@/services/rocketApi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 404 or a rate-limit will not resolve on retry, so fail fast and
      // let the user decide via the retry button.
      retry: (failureCount, error) => {
        if (error instanceof RocketApiError) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})

export const vueQueryOptions: VueQueryPluginOptions = { queryClient }
