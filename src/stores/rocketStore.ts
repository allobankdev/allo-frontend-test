import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/services/rocketApi'
import type { LoadStatus, NewRocketInput, Rocket } from '@/types/rocket'

/** Extracts a readable message from anything that was thrown. */
function toMessage (error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

/** True when the request was cancelled on purpose via AbortController. */
function isAbort (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export const useRocketStore = defineStore('rocket', () => {
  // ---- List state -------------------------------------------------------
  const rockets = ref<Rocket[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)
  const query = ref('') // current text in the filter input

  // ---- Detail state -----------------------------------------------------
  const detail = ref<Rocket | null>(null)
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref<string | null>(null)

    /** Rockets matching the filter text (name or description, case-insensitive). */
  const filteredRockets = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return rockets.value // no filter -> show everything
    return rockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(term)
      || (rocket.description ?? '').toLowerCase().includes(term),
    )
  })

    /** Loads the rocket list and drives the loading / success / error states. */
  async function loadRockets (signal?: AbortSignal) {
    status.value = 'loading'
    error.value = null
    try {
      const fetched = await fetchRockets(signal)
      // Keep rockets the user added locally when the list is reloaded (Retry).
      const local = rockets.value.filter(rocket => rocket.isLocal)
      rockets.value = [...local, ...fetched]
      status.value = 'success'
    } catch (e) {
      if (isAbort(e)) {
        // Cancelled on purpose (the user left the page). Go back to idle so the
        // next visit fetches again instead of staying stuck on "loading".
        status.value = 'idle'
        return
      }
      error.value = toMessage(e)
      status.value = 'error'
    }
  }

    /** Adds a rocket that exists only in the running app (the API is read-only). */
  function addRocket (input: NewRocketInput) {
    const rocket: Rocket = {
      id: `local-${Date.now()}`, // cannot clash with the API's numeric ids
      name: input.name.trim(),
      description: input.description?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      launchCost: input.launchCost ?? null,
      country: input.country?.trim().toUpperCase() || null,
      firstFlight: input.firstFlight || null,
      isLocal: true,
    }
    // Put the new rocket first so the user sees it immediately.
    rockets.value = [rocket, ...rockets.value]
    return rocket
  }

    /** Loads one rocket for the detail page, reusing the list data when possible. */
  async function loadRocketDetail (id: string, signal?: AbortSignal) {
    detailError.value = null

    // The list is fetched with mode=detailed, so a rocket already in the store
    // (including user-added ones) has everything the detail screen needs.
    // Only a direct visit / refresh on /rockets/:id hits the single-rocket API.
    const cached = rockets.value.find(rocket => rocket.id === id)
    if (cached) {
      detail.value = cached
      detailStatus.value = 'success'
      return
    }

    detail.value = null
    detailStatus.value = 'loading'
    try {
      detail.value = await fetchRocketById(id, signal)
      detailStatus.value = 'success'
    } catch (e) {
      if (isAbort(e)) return
      detailError.value = toMessage(e)
      detailStatus.value = 'error'
    }
  }

  return {
    rockets,
    status,
    error,
    query,
    filteredRockets,
    detail,
    detailStatus,
    detailError,
    loadRockets,
    addRocket,
    loadRocketDetail,
  }
})
