// ============================================================
// Pinia Store — rocketStore
// ============================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, RocketFilterState } from '@/types/rocket'
import { fetchRockets, fetchRocketById } from '@/api/rocketApi'

export const useRocketStore = defineStore('rocket', () => {
  // ─── State ─────────────────────────────────────────────────
  const rockets = ref<Rocket[]>([])          // from API
  const localRockets = ref<Rocket[]>([])     // added by user
  const selectedRocket = ref<Rocket | null>(null)

  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const error = ref<string | null>(null)
  const detailError = ref<string | null>(null)

  const filters = ref<RocketFilterState>({ search: '', country: '' })

  // ─── Getters ───────────────────────────────────────────────
  /** All rockets: local first, then API */
  const allRockets = computed<Rocket[]>(() => [...localRockets.value, ...rockets.value])

  const filteredRockets = computed<Rocket[]>(() => {
    const q = filters.value.search.toLowerCase().trim()
    const country = filters.value.country.toLowerCase().trim()

    return allRockets.value.filter(r => {
      const matchSearch = q
        ? (r.full_name ?? '').toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
        : true

      const matchCountry = country
        ? (r.manufacturer?.country_code ?? '').toLowerCase().includes(country)
        : true

      return matchSearch && matchCountry
    })
  })

  const availableCountries = computed<string[]>(() => {
    const codes = allRockets.value
      .map(r => r.manufacturer?.country_code ?? '')
      .filter(Boolean)
    return [...new Set(codes)].sort()
  })

  const hasData = computed(() => rockets.value.length > 0 || localRockets.value.length > 0)

  // ─── Actions ───────────────────────────────────────────────
  async function loadRockets() {
    if (rockets.value.length > 0) return   // already loaded — no re-fetch
    isLoading.value = true
    error.value = null
    try {
      const data = await fetchRockets()
      rockets.value = data.results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.'
    } finally {
      isLoading.value = false
    }
  }

  async function retryLoadRockets() {
    rockets.value = []
    await loadRockets()
  }

  async function loadRocketById(id: number | string) {
    const numId = Number(id)

    // Check local rockets first (they have string IDs)
    const local = localRockets.value.find(r => r.id === numId || String(r.id) === String(id))
    if (local) {
      selectedRocket.value = local
      return
    }

    // Check already-loaded API rockets
    const cached = rockets.value.find(r => r.id === numId)
    if (cached) {
      selectedRocket.value = cached
      return
    }

    // Fetch from API
    isDetailLoading.value = true
    detailError.value = null
    selectedRocket.value = null
    try {
      selectedRocket.value = await fetchRocketById(numId)
    } catch (err) {
      detailError.value = err instanceof Error ? err.message : `Gagal memuat detail roket.`
    } finally {
      isDetailLoading.value = false
    }
  }

  function addLocalRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket)
  }

  function setFilters(newFilters: Partial<RocketFilterState>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = { search: '', country: '' }
  }

  function clearDetail() {
    selectedRocket.value = null
    detailError.value = null
  }

  return {
    // state
    rockets,
    localRockets,
    selectedRocket,
    isLoading,
    isDetailLoading,
    error,
    detailError,
    filters,
    // getters
    allRockets,
    filteredRockets,
    availableCountries,
    hasData,
    // actions
    loadRockets,
    retryLoadRockets,
    loadRocketById,
    addLocalRocket,
    setFilters,
    resetFilters,
    clearDetail,
  }
})
