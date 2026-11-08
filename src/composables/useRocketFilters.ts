/**
 * Binds the rocket list filters to the URL query string.
 * The URL is the source of truth: reload, back/forward, and shared links all keep the filters.
 */

import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import {
  DEFAULT_FILTERS,
  filterRockets,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  type RocketFilters,
} from '@/utils/rocket-filters'

export function useRocketFilters (rockets: MaybeRefOrGetter<readonly Rocket[]>) {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<RocketFilters>({
    get: () => parseFilters(route.query),
    set: next => {
      router.replace({ query: serializeFilters(next) })
    },
  })

  const filteredRockets = computed(() => filterRockets(toValue(rockets), filters.value))
  const isFiltered = computed(() => hasActiveFilters(filters.value))

  function resetFilters (): void {
    filters.value = { ...DEFAULT_FILTERS }
  }

  return { filters, filteredRockets, isFiltered, resetFilters }
}
