/**
 * stores/rockets.ts
 *
 * Single source of truth for the rocket list and detail screens.
 * Keeps the list, the active filter, and both request states here so the
 * components stay presentational.
 */

// Composables
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// Utilities
import { getRocketById, getRockets } from '@/services/rockets'
import { getApiErrorMessage } from '@/utils/errors'

// Types
import type { RequestStatus } from '@/types/api'
import type { NewRocket, Rocket } from '@/types/rocket'

export const useRocketsStore = defineStore('rockets', () => {
  // List state
  const rockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  const search = ref('')

  // Detail state (the list cache is reused when possible)
  const detail = ref<Rocket | null>(null)
  const detailStatus = ref<RequestStatus>('idle')
  const detailError = ref<string | null>(null)
  /** Id of the request that is allowed to write to `detail`. */
  let activeDetailId: number | null = null

  // Getters
  const filteredRockets = computed<Rocket[]>(() => {
    const query = search.value.trim().toLowerCase()

    if (!query) {
      return rockets.value
    }

    return rockets.value.filter((rocket) => {
      const fields = [
        rocket.full_name,
        rocket.name,
        rocket.description,
        rocket.manufacturer?.name,
        rocket.manufacturer?.country_code,
      ]

      return fields.some((field) =>
        field?.toLowerCase().includes(query)
      )
    })
  })

  const isFiltering = computed(() => search.value.trim().length > 0)
  const hasRockets = computed(() => rockets.value.length > 0)
  const hasResults = computed(() => filteredRockets.value.length > 0)

  /** Finds a rocket in the list cache, falling back to the loaded detail. */
  const rocketById = computed(() => (id: number): Rocket | null => {
    return rockets.value.find((rocket) => rocket.id === id)
      ?? (detail.value?.id === id ? detail.value : null)
  })

  // Actions
  async function fetchRockets (force = false) {
    if (status.value === 'loading') {
      return
    }

    // Avoid refetching when navigating back to the list, unless retrying.
    if (!force && status.value === 'success') {
      return
    }

    status.value = 'loading'
    error.value = null

    try {
      rockets.value = await getRockets()
      status.value = 'success'
    } catch (err) {
      rockets.value = []
      error.value = getApiErrorMessage(err)
      status.value = 'error'
    }
  }

  async function fetchRocketById (id: number, force = false) {
    const cached = rocketById.value(id)

    if (cached && !force) {
      // Invalidate any in-flight detail request for another rocket.
      activeDetailId = id
      detail.value = cached
      detailStatus.value = 'success'
      detailError.value = null
      return
    }

    // Ignore duplicate requests for the rocket that is already loading.
    if (detailStatus.value === 'loading' && activeDetailId === id) {
      return
    }

    activeDetailId = id
    detailStatus.value = 'loading'
    detailError.value = null
    detail.value = null

    try {
      const rocket = await getRocketById(id)

      // A newer detail request may have started while this one was in flight.
      if (activeDetailId !== id) {
        return
      }

      detail.value = rocket
      detailStatus.value = 'success'
    } catch (err) {
      if (activeDetailId !== id) {
        return
      }

      detailError.value = getApiErrorMessage(err)
      detailStatus.value = 'error'
    }
  }

  function clearDetail () {
    activeDetailId = null
    detail.value = null
    detailStatus.value = 'idle'
    detailError.value = null
  }

  function addRocket (input: NewRocket): Rocket {
    const rocket: Rocket = {
      // The API is read-only, so locally created rockets get a client id.
      id: Date.now(),
      name: input.full_name,
      full_name: input.full_name,
      description: input.description,
      image_url: input.image_url,
      launch_cost: input.launch_cost,
      maiden_flight: input.maiden_flight,
      manufacturer: {
        id: 0,
        name: 'SpaceX',
        country_code: input.country_code,
      },
      isLocal: true,
    }

    rockets.value.unshift(rocket)
    // Make sure the new rocket is visible even when a filter is active.
    search.value = ''

    return rocket
  }

  function resetFilters () {
    search.value = ''
  }

  return {
    // State
    rockets,
    status,
    error,
    search,
    detail,
    detailStatus,
    detailError,
    // Getters
    filteredRockets,
    isFiltering,
    hasRockets,
    hasResults,
    rocketById,
    // Actions
    fetchRockets,
    fetchRocketById,
    clearDetail,
    addRocket,
    resetFilters,
  }
})
