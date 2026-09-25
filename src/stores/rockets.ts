import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRockets } from '@/services/rocketApi'
import { isAbortError, toErrorMessage } from '@/services/httpClient'
import type { NewRocketInput, RequestStatus, Rocket, RocketFilters } from '@/types/rocket'

const LOCAL_ID_PREFIX = 'local-'

export function isLocalRocketId (id: string): boolean {
  return id.startsWith(LOCAL_ID_PREFIX)
}

function createEmptyFilters (): RocketFilters {
  return { search: '', country: null }
}

/** User-added rockets live only in memory (the API is read-only), so a reload drops them. */
export const useRocketStore = defineStore('rockets', () => {
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  const filters = ref<RocketFilters>(createEmptyFilters())

  let abortController: AbortController | null = null
  let nextLocalId = 1

  /** Newly added rockets first, then the API rockets. */
  const rockets = computed(() => [...localRockets.value, ...remoteRockets.value])

  const countries = computed(() => {
    const codes = rockets.value
      .map(rocket => rocket.country)
      .filter((code): code is string => code != null)
    return [...new Set(codes)].sort()
  })

  const filteredRockets = computed(() => {
    const search = filters.value.search.trim().toLowerCase()
    const { country } = filters.value

    return rockets.value.filter(rocket => {
      if (country && rocket.country !== country) return false
      if (!search) return true
      return rocket.name.toLowerCase().includes(search) ||
        (rocket.description?.toLowerCase().includes(search) ?? false)
    })
  })

  const hasActiveFilters = computed(() =>
    filters.value.search.trim() !== '' || filters.value.country != null,
  )

  /** Fetches the list once; pass `force` to refetch (e.g. retry). */
  async function loadRockets ({ force = false } = {}) {
    if (!force && (status.value === 'success' || status.value === 'loading')) return

    abortController?.abort()
    const controller = new AbortController()
    abortController = controller

    status.value = 'loading'
    error.value = null
    try {
      remoteRockets.value = await fetchRockets(controller.signal)
      status.value = 'success'
    } catch (err) {
      if (isAbortError(err)) return
      error.value = toErrorMessage(err)
      status.value = 'error'
    } finally {
      if (abortController === controller) abortController = null
    }
  }

  function cancelLoad () {
    if (!abortController) return
    abortController.abort()
    abortController = null
    status.value = 'idle'
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      ...input,
      id: `${LOCAL_ID_PREFIX}${nextLocalId++}`,
      isLocal: true,
    }
    localRockets.value.unshift(rocket)
    return rocket
  }

  function findRocket (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id)
  }

  function resetFilters () {
    filters.value = createEmptyFilters()
  }

  return {
    rockets,
    filteredRockets,
    countries,
    filters,
    hasActiveFilters,
    status,
    error,
    loadRockets,
    cancelLoad,
    addRocket,
    findRocket,
    resetFilters,
  }
})
