/**
 * stores/rocketStore.ts
 *
 * Pinia store for rocket state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, FilterStatus } from '@/types/rocket'
import { fetchRockets, fetchRocketById } from '@/services/rocketApi'

export const useRocketStore = defineStore('rocket', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterStatus = ref<FilterStatus>('all')
  const searchQuery = ref('')
  const selectedRocket = ref<Rocket | null>(null)
  const detailLoading = ref(false)
  const detailError = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const filteredRockets = computed(() => {
    let list = rockets.value

    // Filter by image availability
    if (filterStatus.value === 'with-image') {
      list = list.filter((r) => !!r.image_url)
    } else if (filterStatus.value === 'no-image') {
      list = list.filter((r) => !r.image_url)
    }

    // Filter by search query
    const query = searchQuery.value.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.manufacturer?.country_code?.toLowerCase().includes(query),
      )
    }

    return list
  })

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Load all SpaceX rockets from the API
   */
  async function loadRockets() {
    // Don't refetch if we already have data (unless explicitly retrying)
    loading.value = true
    error.value = null
    try {
      const data = await fetchRockets()
      // Merge local rockets so they survive re-fetches
      const localRockets = rockets.value.filter((r) => r.isLocal)
      rockets.value = [...data.results, ...localRockets]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      loading.value = false
    }
  }

  /**
   * Retry fetching rockets (same as loadRockets but can be called from UI)
   */
  async function retryLoadRockets() {
    await loadRockets()
  }

  /**
   * Load a single rocket detail by ID
   */
  async function loadRocketDetail(id: number) {
    // Check if it's a local rocket first
    const local = rockets.value.find((r) => r.id === id && r.isLocal)
    if (local) {
      selectedRocket.value = local
      return
    }

    detailLoading.value = true
    detailError.value = null
    selectedRocket.value = null

    try {
      const data = await fetchRocketById(id)
      selectedRocket.value = data
    } catch (err) {
      detailError.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      detailLoading.value = false
    }
  }

  /**
   * Retry fetching a single rocket detail
   */
  async function retryLoadRocketDetail(id: number) {
    await loadRocketDetail(id)
  }

  /**
   * Add a new rocket locally (API is read-only)
   */
  function addLocalRocket(rocketData: Omit<Rocket, 'id'>) {
    const newRocket: Rocket = {
      ...rocketData,
      id: Date.now(), // generate a unique local ID
      isLocal: true,
    }
    rockets.value = [newRocket, ...rockets.value]
  }

  /**
   * Update filter status
   */
  function setFilterStatus(status: FilterStatus) {
    filterStatus.value = status
  }

  /**
   * Update search query
   */
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  /**
   * Clear the selected rocket
   */
  function clearSelectedRocket() {
    selectedRocket.value = null
    detailError.value = null
  }

  return {
    // State
    rockets,
    loading,
    error,
    filterStatus,
    searchQuery,
    selectedRocket,
    detailLoading,
    detailError,
    // Getters
    filteredRockets,
    // Actions
    loadRockets,
    retryLoadRockets,
    loadRocketDetail,
    retryLoadRocketDetail,
    addLocalRocket,
    setFilterStatus,
    setSearchQuery,
    clearSelectedRocket,
  }
})

