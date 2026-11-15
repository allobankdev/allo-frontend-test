/**
 * stores/rockets.ts
 *
 * Rocket state: API list + detail cache, locally added rockets,
 * request status, and list filters.
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ApiError } from '@/services/apiClient'
import { getRocketById, getRockets } from '@/services/rocketService'
import { getErrorMessage, isAbortError } from '@/utils/error'
import { createLocalId, isLocalId } from '@/utils/id'
import type { NewRocketInput, RequestStatus, Rocket, RocketFilters, RocketSpecs } from '@/types/rocket'

const DEFAULT_FILTERS: RocketFilters = { query: '', country: null, source: 'all' }

const EMPTY_SPECS: RocketSpecs = {
  length: null,
  diameter: null,
  launchMass: null,
  leoCapacity: null,
  gtoCapacity: null,
  thrust: null,
  minStage: null,
  maxStage: null,
  apogee: null,
  vehicleRange: null,
}

export const useRocketStore = defineStore('rockets', () => {
  // State
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  /** Rockets fetched individually (e.g. a detail URL opened directly). */
  const detailCache = ref<Record<string, Rocket>>({})

  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)
  const detailStatus = ref<RequestStatus>('idle')
  const detailError = ref<string | null>(null)
  /** True when the requested rocket does not exist (unknown local id or API 404). */
  const detailNotFound = ref(false)

  const filters = ref<RocketFilters>({ ...DEFAULT_FILTERS })

  // In-flight requests (not reactive state)
  let listRequest: Promise<void> | null = null
  let detailRequest: { id: string, controller: AbortController, promise: Promise<Rocket | null> } | null = null

  // Getters
  /** Local rockets first so newly added rockets appear at the top. */
  const rockets = computed<Rocket[]>(() => [...localRockets.value, ...apiRockets.value])

  const countries = computed<string[]>(() => {
    const codes = rockets.value
      .map(rocket => rocket.country)
      .filter((country): country is string => country !== null)
    return [...new Set(codes)].sort()
  })

  const filteredRockets = computed<Rocket[]>(() => {
    const { query, country, source } = filters.value
    const normalizedQuery = query.trim().toLowerCase()

    return rockets.value.filter(rocket => {
      if (source === 'api' && rocket.isLocal) return false
      if (source === 'local' && !rocket.isLocal) return false
      if (country && rocket.country !== country) return false
      if (!normalizedQuery) return true
      return rocket.name.toLowerCase().includes(normalizedQuery)
        || (rocket.description?.toLowerCase().includes(normalizedQuery) ?? false)
    })
  })

  const hasActiveFilters = computed<boolean>(() => {
    const { query, country, source } = filters.value
    return query.trim() !== '' || country !== null || source !== DEFAULT_FILTERS.source
  })

  function getRocket (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id) ?? detailCache.value[id]
  }

  // Actions
  /** Fetches the list once; later calls reuse the cache unless `force` is true (e.g. Retry). */
  function fetchRockets (options: { force?: boolean } = {}): Promise<void> {
    if (listRequest) return listRequest
    if (listStatus.value === 'success' && !options.force) return Promise.resolve()

    listStatus.value = 'loading'
    listError.value = null

    listRequest = getRockets()
      .then(result => {
        apiRockets.value = result
        listStatus.value = 'success'
      })
      .catch((error: unknown) => {
        listError.value = getErrorMessage(error)
        listStatus.value = 'error'
      })
      .finally(() => {
        listRequest = null
      })

    return listRequest
  }

  /**
   * Resolves a rocket for the detail screen. Uses local/cached data first and
   * only calls the API for unknown, non-local ids.
   */
  function fetchRocketById (id: string): Promise<Rocket | null> {
    if (detailRequest?.id === id) return detailRequest.promise
    cancelDetailRequest()

    const cached = getRocket(id)
    if (cached || isLocalId(id)) {
      detailStatus.value = cached ? 'success' : 'error'
      detailError.value = cached ? null : 'Rocket not found.'
      detailNotFound.value = !cached
      return Promise.resolve(cached ?? null)
    }

    detailStatus.value = 'loading'
    detailError.value = null
    detailNotFound.value = false

    const controller = new AbortController()
    const promise = getRocketById(id, controller.signal)
      .then(rocket => {
        detailCache.value[id] = rocket
        detailStatus.value = 'success'
        return rocket
      })
      .catch((error: unknown) => {
        // A cancelled request is not an error; the next request owns the state.
        if (isAbortError(error)) return null
        detailError.value = getErrorMessage(error)
        detailNotFound.value = error instanceof ApiError && error.status === 404
        detailStatus.value = 'error'
        return null
      })
      .finally(() => {
        if (detailRequest?.controller === controller) detailRequest = null
      })

    detailRequest = { id, controller, promise }
    return promise
  }

  /**
   * Aborts the in-flight detail request and clears the detail status, e.g. when
   * leaving the detail screen, so a stale error doesn't leak into other screens.
   */
  function cancelDetailRequest (): void {
    detailRequest?.controller.abort()
    detailRequest = null
    detailStatus.value = 'idle'
    detailError.value = null
    detailNotFound.value = false
  }

  /** Adds a rocket to the running app only; the API is read-only, so nothing is sent. */
  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      family: null,
      variant: null,
      alias: null,
      active: null,
      reusable: null,
      infoUrl: null,
      wikiUrl: null,
      manufacturer: null,
      programs: [],
      stats: null,
      ...input,
      specs: { ...EMPTY_SPECS, ...input.specs },
      id: createLocalId(),
      name: input.name.trim(),
      isLocal: true,
    }
    localRockets.value.unshift(rocket)
    return rocket
  }

  function setFilters (patch: Partial<RocketFilters>): void {
    filters.value = { ...filters.value, ...patch }
  }

  function resetFilters (): void {
    filters.value = { ...DEFAULT_FILTERS }
  }

  return {
    // state
    apiRockets,
    localRockets,
    listStatus,
    listError,
    detailStatus,
    detailError,
    detailNotFound,
    filters,
    // getters
    rockets,
    countries,
    filteredRockets,
    hasActiveFilters,
    getRocket,
    // actions
    fetchRockets,
    fetchRocketById,
    cancelDetailRequest,
    addRocket,
    setFilters,
    resetFilters,
  }
})
