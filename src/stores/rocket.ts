/**
 * stores/rocket.ts
 *
 * Single source of truth for rockets: the list fetched from the API,
 * rockets added by the user (kept in memory only — the API is read-only),
 * the list filters, and the state of the current list / detail requests.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/services/rocketApi'
import { ApiError, isAbortError } from '@/services/http'
import { DEFAULT_ROCKET_FILTERS, filterRockets } from '@/utils/filterRockets'
import type { NewRocketInput, Rocket, RocketFilters } from '@/types/rocket'
import type { RequestStatus } from '@/types/request'

const CUSTOM_ID_PREFIX = 'custom-'
const GENERIC_ERROR = 'Something went wrong. Please try again.'

export const useRocketStore = defineStore('rocket', () => {
  // ---- State ----
  const apiRockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  /** Rockets fetched one by one (e.g. a detail URL opened directly), keyed by id. */
  const fetchedRockets = ref<Record<string, Rocket>>({})

  const filters = ref<RocketFilters>({ ...DEFAULT_ROCKET_FILTERS })

  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)

  const detailStatus = ref<RequestStatus>('idle')
  const detailError = ref<string | null>(null)
  const detailNotFound = ref(false)
  const currentRocketId = ref<string | null>(null)

  let listController: AbortController | null = null
  let detailController: AbortController | null = null

  // ---- Getters ----
  /** Newest user-added rockets first, then the API list. */
  const allRockets = computed(() => [...customRockets.value, ...apiRockets.value])

  const filteredRockets = computed(() => filterRockets(allRockets.value, filters.value))

  const hasActiveFilters = computed(() =>
    filters.value.search.trim() !== '' || filters.value.active !== DEFAULT_ROCKET_FILTERS.active,
  )

  const currentRocket = computed(() =>
    currentRocketId.value ? findRocket(currentRocketId.value) : null,
  )

  function findRocket (id: string): Rocket | null {
    return allRockets.value.find(rocket => rocket.id === id)
      ?? fetchedRockets.value[id]
      ?? null
  }

  // ---- Actions ----
  /** Loads the rocket list. Cached after the first success unless `force` is set (Retry). */
  async function loadRockets ({ force = false } = {}): Promise<void> {
    if (!force && (listStatus.value === 'success' || listStatus.value === 'loading')) return

    listController?.abort()
    const controller = new AbortController()
    listController = controller

    listStatus.value = 'loading'
    listError.value = null

    try {
      apiRockets.value = await fetchRockets(controller.signal)
      listStatus.value = 'success'
    } catch (error) {
      if (isAbortError(error)) return
      listError.value = toMessage(error)
      listStatus.value = 'error'
    } finally {
      if (listController === controller) listController = null
    }
  }

  /** Loads one rocket for the detail screen, reusing already loaded data when possible. */
  async function loadRocket (id: string, { force = false } = {}): Promise<void> {
    // A newer request supersedes the previous one (fast navigation between rockets).
    detailController?.abort()
    detailController = null

    currentRocketId.value = id
    detailError.value = null
    detailNotFound.value = false

    if (!force && findRocket(id)) {
      detailStatus.value = 'success'
      return
    }

    // User-added rockets only exist in memory; if one is gone there is nothing to fetch.
    if (id.startsWith(CUSTOM_ID_PREFIX)) {
      setDetailNotFound()
      return
    }

    const controller = new AbortController()
    detailController = controller
    detailStatus.value = 'loading'

    try {
      const rocket = await fetchRocketById(id, controller.signal)
      fetchedRockets.value[rocket.id] = rocket
      detailStatus.value = 'success'
    } catch (error) {
      if (isAbortError(error)) return
      if (error instanceof ApiError && error.isNotFound) {
        setDetailNotFound()
        return
      }
      detailError.value = toMessage(error)
      detailStatus.value = 'error'
    } finally {
      if (detailController === controller) detailController = null
    }
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      id: `${CUSTOM_ID_PREFIX}${createId()}`,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      launchCost: input.launchCost ?? null,
      countryCode: input.countryCode?.trim().toUpperCase() || null,
      firstFlight: input.firstFlight || null,
      active: input.active ?? null,
      isCustom: true,
    }

    customRockets.value.unshift(rocket)
    return rocket
  }

  function setFilters (patch: Partial<RocketFilters>): void {
    filters.value = { ...filters.value, ...patch }
  }

  function resetFilters (): void {
    filters.value = { ...DEFAULT_ROCKET_FILTERS }
  }

  function setDetailNotFound (): void {
    detailNotFound.value = true
    detailError.value = 'Rocket not found.'
    detailStatus.value = 'error'
  }

  return {
    // state
    apiRockets,
    customRockets,
    filters,
    listStatus,
    listError,
    detailStatus,
    detailError,
    detailNotFound,
    currentRocketId,
    // getters
    allRockets,
    filteredRockets,
    hasActiveFilters,
    currentRocket,
    findRocket,
    // actions
    loadRockets,
    loadRocket,
    addRocket,
    setFilters,
    resetFilters,
  }
})

function toMessage (error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_ERROR
}

function createId (): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
