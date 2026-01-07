/**
 * Rocket store using Pinia
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { spaceXApiService } from '@/services/spacex-api'
import type { Rocket, RocketFormData } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filterText = ref('')

  // Getters
  const filteredRockets = computed(() => {
    if (!filterText.value.trim()) {
      return rockets.value
    }

    const searchLower = filterText.value.toLowerCase()
    return rockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(searchLower) ||
      rocket.description.toLowerCase().includes(searchLower) ||
      rocket.country.toLowerCase().includes(searchLower)
    )
  })

  // Actions
  async function fetchRockets() {
    isLoading.value = true
    error.value = null

    try {
      const data = await spaceXApiService.getRockets()
      rockets.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rockets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRocketById(id: string): Promise<Rocket> {
    isLoading.value = true
    error.value = null

    try {
      const rocket = await spaceXApiService.getRocketById(id)
      
      // Update or add rocket to list if not exists
      const index = rockets.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rockets.value[index] = rocket
      } else {
        rockets.value.push(rocket)
      }

      return rocket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rocket'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function addRocket(rocketData: RocketFormData) {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      ...rocketData,
    }
    
    rockets.value.push(newRocket)
    return newRocket
  }

  function setFilter(text: string) {
    filterText.value = text
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rockets,
    isLoading,
    error,
    filterText,
    
    // Getters
    filteredRockets,
    
    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilter,
    clearError,
  }
})

