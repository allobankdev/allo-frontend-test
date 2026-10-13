/**
 * rocketStore.ts
 *
 * Manages the rocket list state:
 *  - fetching from the API (with loading / error states)
 *  - in-memory list including locally-added rockets
 *  - text filter applied on top of the full list
 *  - adding a new rocket locally (API is read-only)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', () => {
  // ─── State ────────────────────────────────────────────────────────────────

  /** All rockets: fetched from API + any locally added ones */
  const rockets = ref<Rocket[]>([])

  /** Current filter string (matches against full_name) */
  const filterQuery = ref('')

  /** Current fetch lifecycle status */
  const status = ref<FetchStatus>('idle')

  /** Last error message, if any */
  const errorMessage = ref<string | null>(null)

  // Counter used to generate unique negative IDs for locally-added rockets
  // so they never clash with API ids (which are positive integers).
  let localIdCounter = -1

  // ─── Getters ──────────────────────────────────────────────────────────────

  /** Rockets filtered by the current search query (case-insensitive) */
  const filteredRockets = computed(() => {
    const query = filterQuery.value.trim().toLowerCase()
    if (!query) return rockets.value
    return rockets.value.filter((r) =>
      r.full_name.toLowerCase().includes(query)
    )
  })

  const isLoading = computed(() => status.value === 'loading')
  const isError = computed(() => status.value === 'error')
  const isSuccess = computed(() => status.value === 'success')

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Load rockets from the API. Safe to call multiple times (for retry). */
  async function loadRockets() {
    // Don't re-fetch if we already have data, unless retrying after an error
    if (status.value === 'success') return

    status.value = 'loading'
    errorMessage.value = null

    try {
      const apiRockets = await fetchRockets()
      // Preserve any locally-added rockets across retries
      const localRockets = rockets.value.filter((r) => r.isLocal)
      rockets.value = [...apiRockets, ...localRockets]
      status.value = 'success'
    } catch (err) {
      errorMessage.value =
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      status.value = 'error'
    }
  }

  /** Force a fresh fetch (used by Retry button). */
  async function retryLoadRockets() {
    status.value = 'idle'
    await loadRockets()
  }

  /**
   * Add a new rocket to the local list only.
   * The API is read-only, so this data lives in memory for the current session.
   */
  function addLocalRocket(
    payload: Pick<Rocket, 'full_name' | 'description' | 'image_url'>
  ) {
    const newRocket: Rocket = {
      id: localIdCounter--,
      full_name: payload.full_name,
      description: payload.description ?? null,
      image_url: payload.image_url ?? null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
      isLocal: true,
    }
    rockets.value = [newRocket, ...rockets.value]
  }

  /** Update the text filter */
  function setFilter(query: string) {
    filterQuery.value = query
  }

  return {
    // state
    rockets,
    filterQuery,
    status,
    errorMessage,
    // getters
    filteredRockets,
    isLoading,
    isError,
    isSuccess,
    // actions
    loadRockets,
    retryLoadRockets,
    addLocalRocket,
    setFilter,
  }
})
