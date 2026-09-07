import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, NewRocket } from '@/types/rocket'
import { rocketApi } from '@/services/api'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<NewRocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterQuery = ref('')

  // Getters
  const allRockets = computed(() => {
    return [...rockets.value, ...customRockets.value]
  })

  const filteredRockets = computed(() => {
    if (!filterQuery.value.trim()) {
      return allRockets.value
    }
    
    const query = filterQuery.value.toLowerCase()
    return allRockets.value.filter((rocket) => {
      return (
        rocket.full_name.toLowerCase().includes(query) ||
        rocket.name.toLowerCase().includes(query) ||
        rocket.description?.toLowerCase().includes(query)
      )
    })
  })

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null
    
    try {
      rockets.value = await rocketApi.getRockets()
    } catch (err: any) {
      if (err.response) {
        error.value = `Failed to fetch rockets: ${err.response.status} ${err.response.statusText}`
      } else if (err.request) {
        error.value = 'Network error. Check your connection.'
      } else {
        error.value = err.message || 'Failed to fetch rockets'
      }
      console.error('Error fetching rockets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: number): Promise<Rocket | NewRocket | undefined> {
    // Check if it's a custom rocket
    const customRocket = customRockets.value.find(r => r.id === id)
    if (customRocket) {
      return customRocket
    }

    // Check if it's already in the store
    const existingRocket = rockets.value.find(r => r.id === id)
    if (existingRocket) {
      return existingRocket
    }

    // Fetch from API
    loading.value = true
    error.value = null
    
    try {
      const rocket = await rocketApi.getRocketById(id)
      // Update the rocket in store if it exists, otherwise add it
      const index = rockets.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rockets.value[index] = rocket
      } else {
        rockets.value.push(rocket)
      }
      return rocket
    } catch (err: any) {
      if (err.response?.status === 404) {
        error.value = 'Rocket not found'
      } else if (err.request) {
        error.value = 'Network error. Check your connection.'
      } else {
        error.value = err.message || 'Failed to fetch rocket'
      }
      console.error('Error fetching rocket:', err)
      return undefined
    } finally {
      loading.value = false
    }
  }

  function addCustomRocket(rocket: NewRocket) {
    customRockets.value.push(rocket)
  }

  function setFilterQuery(query: string) {
    filterQuery.value = query
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rockets,
    customRockets,
    loading,
    error,
    filterQuery,
    // Getters
    allRockets,
    filteredRockets,
    // Actions
    fetchRockets,
    fetchRocketById,
    addCustomRocket,
    setFilterQuery,
    clearError,
  }
})
