import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { rocketService } from '@/services/rocketService'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  // Getters
  const filteredRockets = computed(() => {
    if (!searchQuery.value) {
      return rockets.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return rockets.value.filter(rocket => 
      rocket.full_name.toLowerCase().includes(query) ||
      rocket.description.toLowerCase().includes(query)
    )
  })

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null
    
    try {
      rockets.value = await rocketService.getAllRockets()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch rockets'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: number): Promise<Rocket> {
    loading.value = true
    error.value = null
    
    try {
      return await rocketService.getRocketById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch rocket'
      throw e
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    // Add new rocket to the beginning of the list
    rockets.value.unshift(rocket)
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
    searchQuery,
    // Getters
    filteredRockets,
    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setSearchQuery,
    clearError
  }
})
