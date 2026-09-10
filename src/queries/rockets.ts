/**
 * queries/rockets.ts
 *
 * TanStack Query bindings for rocket data. Server state (fetching, caching,
 * retries, loading/error flags) lives here; client-only state lives in the
 * Pinia store.
 */

import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { fetchRocketById, fetchRockets, RocketApiError } from '@/services/rocketApi'
import { useRocketsStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

const GENERIC_ERROR = 'Something went wrong while loading rockets. Please try again.'

export const rocketKeys = {
  all: ['rockets'] as const,
  list: () => [...rocketKeys.all, 'list'] as const,
  detail: (id: string) => [...rocketKeys.all, 'detail', id] as const,
}

/** Extracts a presentable message, hiding unexpected internals from users. */
export function toErrorMessage (error: unknown): string {
  return error instanceof RocketApiError ? error.message : GENERIC_ERROR
}

/** Rockets are static reference data, so cache them generously. */
const STALE_TIME = 5 * 60 * 1000

/** Fetches the SpaceX rocket list. */
export function useRocketsQuery () {
  return useQuery({
    queryKey: rocketKeys.list(),
    queryFn: ({ signal }) => fetchRockets(signal),
    staleTime: STALE_TIME,
  })
}

/**
 * Fetches one rocket for the detail screen.
 *
 * Rockets added in-app exist only in the Pinia store, so the query is
 * disabled for them and their data is served straight from that store.
 */
export function useRocketQuery (id: MaybeRefOrGetter<string>) {
  const store = useRocketsStore()

  const rocketId = computed(() => toValue(id))
  const localRocket = computed(() => store.findLocalRocket(rocketId.value))

  const query = useQuery({
    queryKey: computed(() => rocketKeys.detail(rocketId.value)),
    queryFn: ({ signal }) => fetchRocketById(rocketId.value, signal),
    enabled: computed(() => Boolean(rocketId.value) && !localRocket.value),
    staleTime: STALE_TIME,
  })

  const rocket = computed<Rocket | undefined>(() => localRocket.value ?? query.data.value)
  const isLoading = computed(() => !localRocket.value && query.isPending.value && query.isFetching.value)
  const isError = computed(() => !localRocket.value && query.isError.value)

  return { ...query, rocket, isLoading, isError }
}
