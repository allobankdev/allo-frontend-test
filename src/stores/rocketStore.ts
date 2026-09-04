import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, NewRocketInput } from '@/types/rocket'
import { fetchLaunchers, fetchLauncherById } from '@/api/rockets'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const detailLoading = ref(false)
  const error = ref<string | null>(null)
  const detailError = ref<string | null>(null)
  const isInitialized = ref(false)

  const allRockets = computed<Rocket[]>(() => {
    return [...customRockets.value, ...rockets.value]
  })

  const filteredRockets = computed<Rocket[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) {
      return allRockets.value
    }
    return allRockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(query)
    )
  })

  async function loadRockets(force = false): Promise<void> {
    if (isInitialized.value && !force && rockets.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchLaunchers()
      rockets.value = data
      isInitialized.value = true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch rockets from API'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function loadRocketById(id: string | number, force = false): Promise<Rocket | null> {
    const stringId = String(id)
    const existing = allRockets.value.find(r => String(r.id) === stringId)
    if (existing && !force) {
      selectedRocket.value = existing
      return existing
    }

    if (existing?.isCustom) {
      selectedRocket.value = existing
      return existing
    }

    detailLoading.value = true
    detailError.value = null

    try {
      const rocket = await fetchLauncherById(id)
      selectedRocket.value = rocket

      const index = rockets.value.findIndex(r => String(r.id) === stringId)
      if (index !== -1) {
        rockets.value[index] = rocket
      }
      return rocket
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to fetch rocket #${id}`
      detailError.value = message
      return null
    } finally {
      detailLoading.value = false
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: input.name.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl?.trim() || null,
      launchCost: input.launchCost?.trim() || null,
      country: input.country?.trim() || 'USA',
      maidenFlight: input.maidenFlight?.trim() || null,
      isCustom: true,
    }

    customRockets.value.unshift(newRocket)
    return newRocket
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  return {
    rockets,
    customRockets,
    selectedRocket,
    searchQuery,
    loading,
    detailLoading,
    error,
    detailError,
    isInitialized,
    allRockets,
    filteredRockets,
    loadRockets,
    loadRocketById,
    addRocket,
    setSearchQuery,
  }
})
