import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { rocketApi } from '@/api/rocketApi'
import type { CreateRocketDto, Rocket, RocketStatusFilter } from '@/types/rocket'
import { DEFAULT_MANUFACTURER_COUNTRY, DEFAULT_ROCKET_IMAGE } from '@/utils/constants'

export const useRocketStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const loading = ref<boolean>(false)
  const detailLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const searchQuery = ref<string>('')
  const statusFilter = ref<RocketStatusFilter>('all')

  // Computed
  const allRockets = computed<Rocket[]>(() => {
    return [...customRockets.value, ...rockets.value]
  })

  const filteredRockets = computed<Rocket[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const filter = statusFilter.value

    return allRockets.value.filter((rocket) => {
      // Status filter
      if (filter === 'active' && !rocket.active) return false
      if (filter === 'retired' && rocket.active) return false

      // Search query
      if (!query) return true

      const matchName = rocket.name.toLowerCase().includes(query)
      const matchFullName = rocket.fullName.toLowerCase().includes(query)
      const matchDesc = rocket.description?.toLowerCase().includes(query) ?? false
      const matchFamily = rocket.family?.toLowerCase().includes(query) ?? false

      return matchName || matchFullName || matchDesc || matchFamily
    })
  })

  const totalCount = computed(() => allRockets.value.length)
  const filteredCount = computed(() => filteredRockets.value.length)
  const hasRockets = computed(() => allRockets.value.length > 0)

  // Actions
  async function fetchRockets (force = false): Promise<void> {
    if (rockets.value.length > 0 && !force) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await rocketApi.fetchSpaceXRockets()
      rockets.value = data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while fetching rockets.'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketDetail (id: string | number): Promise<Rocket | null> {
    error.value = null

    // 1. Check local store (custom rockets or cached API rockets)
    const existing = allRockets.value.find((r) => String(r.id) === String(id))
    if (existing) {
      selectedRocket.value = existing
      return existing
    }

    // 2. Otherwise fetch from API
    detailLoading.value = true
    try {
      const rocket = await rocketApi.fetchRocketById(id)
      selectedRocket.value = rocket
      return rocket
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to load details for rocket #${id}.`
      error.value = message
      selectedRocket.value = null
      return null
    } finally {
      detailLoading.value = false
    }
  }

  function addRocket (dto: CreateRocketDto): Rocket {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: dto.fullName,
      fullName: dto.fullName,
      description: dto.description.trim() || null,
      launchCost: dto.launchCost || null,
      countryCode: dto.countryCode || DEFAULT_MANUFACTURER_COUNTRY,
      maidenFlight: dto.maidenFlight || null,
      imageUrl: dto.imageUrl?.trim() || DEFAULT_ROCKET_IMAGE,
      family: dto.family || 'Custom',
      active: dto.active ?? true,
      reusable: dto.reusable ?? true,
      isCustom: true,
    }

    // Immutably prepend to customRockets
    customRockets.value = [newRocket, ...customRockets.value]
    return newRocket
  }

  function setSearchQuery (query: string): void {
    searchQuery.value = query
  }

  function setStatusFilter (status: RocketStatusFilter): void {
    statusFilter.value = status
  }

  function clearFilters (): void {
    searchQuery.value = ''
    statusFilter.value = 'all'
  }

  function retry (): void {
    fetchRockets(true)
  }

  return {
    // State
    rockets,
    customRockets,
    selectedRocket,
    loading,
    detailLoading,
    error,
    searchQuery,
    statusFilter,
    // Computed
    allRockets,
    filteredRockets,
    totalCount,
    filteredCount,
    hasRockets,
    // Actions
    fetchRockets,
    fetchRocketDetail,
    addRocket,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
    retry,
  }
})
