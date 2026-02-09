import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { rocketApi } from '@/services/api'

export const useRocketsStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterActive = ref<boolean | null>(null)
  const searchQuery = ref('')

  // Getters (Computed)
  const filteredRockets = computed(() => {
    let result = rockets.value

    // Filter by active status
    if (filterActive.value !== null) {
      result = result.filter(rocket => rocket.active === filterActive.value)
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(rocket =>
        rocket.name.toLowerCase().includes(query) ||
        rocket.description.toLowerCase().includes(query) ||
        rocket.country.toLowerCase().includes(query)
      )
    }

    return result
  })

  const getRocketById = computed(() => {
    return (id: string) => rockets.value.find(rocket => rocket.id === id)
  })

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      rockets.value = await rocketApi.getAllRockets()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rockets'
      console.error('Error fetching rockets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: string) {
    loading.value = true
    error.value = null

    try {
      const rocket = await rocketApi.getRocketById(id)

      // Update the rocket in the store if it exists
      const index = rockets.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rockets.value[index] = rocket
      } else {
        rockets.value.push(rocket)
      }

      return rocket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rocket details'
      console.error('Error fetching rocket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addRocket(newRocket: Partial<Rocket>) {
    loading.value = true
    error.value = null

    try {
      const rocket = await rocketApi.addRocket(newRocket)
      rockets.value.unshift(rocket) // Add to beginning of array
      return rocket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add rocket'
      console.error('Error adding rocket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilter(active: boolean | null) {
    filterActive.value = active
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rockets,
    loading,
    error,
    filterActive,
    searchQuery,

    // Getters
    filteredRockets,
    getRocketById,

    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilter,
    setSearchQuery,
    clearError,
  }
})
