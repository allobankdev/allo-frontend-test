import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchRockets, fetchRocketById } from '@/services/rocketService'
import type { Rocket, LocalRocket, LoadingState } from '@/types'

const LOCAL_STORAGE_KEY = 'local-rockets'
const PER_PAGE = 4

export const useRocketStore = defineStore('rocket', () => {
  // ─── State ────

  const rockets = ref<Rocket[]>([])
  const localRockets = ref<LocalRocket[]>([])
  const currentRocket = ref<Rocket | LocalRocket | null>(null)
  const loadingState = ref<LoadingState>('idle')
  const detailLoadingState = ref<LoadingState>('idle')
  const errorMessage = ref('')
  const detailErrorMessage = ref('')
  const searchQuery = ref('')
  const currentPage = ref(1)

  // ─── Computed ───

  /** Local rockets first, then API rockets */
  const allRockets = computed<(Rocket | LocalRocket)[]>(() => {
    return [...localRockets.value, ...rockets.value]
  })

  /** Filtered by search query */
  const filteredRockets = computed(() => {
    if (!searchQuery.value.trim()) return allRockets.value

    const q = searchQuery.value.toLowerCase()
    return allRockets.value.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q),
    )
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredRockets.value.length / PER_PAGE)))

  /** Current page of rockets to display */
  const paginatedRockets = computed(() => {
    const start = (currentPage.value - 1) * PER_PAGE
    return filteredRockets.value.slice(start, start + PER_PAGE)
  })

  // ─── Local Storage ───

  function loadLocalRockets() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        localRockets.value = JSON.parse(stored)
      }
    } catch {
      localRockets.value = []
    }
  }

  function saveLocalRockets() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRockets.value))
  }

  // ─── Actions ───

  async function loadRockets() {
    loadingState.value = 'loading'
    errorMessage.value = ''

    try {
      rockets.value = await fetchRockets()
      loadLocalRockets()
      currentPage.value = 1
      loadingState.value = 'success'
    } catch (error) {
      loadingState.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  function applySearch(query: string) {
    searchQuery.value = query
    currentPage.value = 1
  }

  async function loadRocketDetail(id: string) {
    detailLoadingState.value = 'loading'
    detailErrorMessage.value = ''

    // Check local rockets first
    const local = localRockets.value.find((r) => r.id === id)
    if (local) {
      currentRocket.value = local
      detailLoadingState.value = 'success'
      return
    }

    // Check already loaded rockets
    const cached = rockets.value.find((r) => r.id === id)
    if (cached) {
      currentRocket.value = cached
      detailLoadingState.value = 'success'
      return
    }

    try {
      currentRocket.value = await fetchRocketById(id)
      detailLoadingState.value = 'success'
    } catch (error) {
      detailLoadingState.value = 'error'
      detailErrorMessage.value =
        error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }

  function addRocket(rocket: Omit<LocalRocket, 'id' | 'isLocal'>) {
    const newRocket: LocalRocket = {
      ...rocket,
      id: `local-${Date.now()}`,
      isLocal: true,
    }
    localRockets.value.unshift(newRocket)
    saveLocalRockets()
  }

  return {
    // State
    rockets,
    localRockets,
    currentRocket,
    loadingState,
    detailLoadingState,
    errorMessage,
    detailErrorMessage,
    searchQuery,
    currentPage,
    // Computed
    allRockets,
    filteredRockets,
    totalPages,
    paginatedRockets,
    // Actions
    loadRockets,
    goToPage,
    applySearch,
    loadRocketDetail,
    addRocket,
  }
})
