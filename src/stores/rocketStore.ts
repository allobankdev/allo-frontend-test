import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rocketService } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const selectedRocket = ref<Rocket | null>(null)
  const detailLoading = ref(false)
  const detailError = ref<string | null>(null)

  const filteredRockets = computed(() => {
    if (!searchQuery.value.trim()) {
      return rockets.value
    }
    return rocketService.searchRockets(rockets.value, searchQuery.value)
  })

  const hasRockets = computed(() => rockets.value.length > 0)
  const rocketCount = computed(() => rockets.value.length)

  const fetchAllRockets = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await rocketService.getAllRockets()
      rockets.value = data
    } catch (err) {
      error.value = 'Failed to fetch rockets. Please try again.'
      console.error('Fetch rockets error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchRocketById = async (id: string) => {
    detailLoading.value = true
    detailError.value = null

    try {
      const localRocket = rockets.value.find((r) => r.id === id)

      if (localRocket) {
        selectedRocket.value = localRocket
        return
      }

      const data = await rocketService.getRocketById(id)
      selectedRocket.value = data
    } catch (err: any) {
      console.error('Fetch rocket detail error:', err)

      if (err?.response?.status === 404) {
        detailError.value = 'Rocket not found.'
      } else {
        detailError.value = 'Failed to fetch rocket details. Please try again.'
      }

      selectedRocket.value = null
    } finally {
      detailLoading.value = false
    }
  }

  const addRocket = async (rocketData: Rocket) => {
    try {
      const newRocket = await rocketService.createRocket(rocketData)
      rockets.value.unshift(newRocket)
      return newRocket
    } catch (err) {
      error.value = 'Failed to create rocket.'
      console.error('Create rocket error:', err)
      throw err
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearError = () => {
    error.value = null
  }

  const clearDetailError = () => {
    detailError.value = null
  }

  const resetSelectedRocket = () => {
    selectedRocket.value = null
  }

  return {
    rockets,
    loading,
    error,
    searchQuery,
    selectedRocket,
    detailLoading,
    detailError,

    filteredRockets,
    hasRockets,
    rocketCount,

    fetchAllRockets,
    fetchRocketById,
    addRocket,
    setSearchQuery,
    clearError,
    clearDetailError,
    resetSelectedRocket,
  }
})
