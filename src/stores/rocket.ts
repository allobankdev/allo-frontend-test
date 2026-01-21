import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, RocketFilters } from '@/types/rocket'
import { rocketApi } from '@/services/api'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const currentRocket = ref<Rocket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<RocketFilters>({
    search: '',
    active: null,
  })

  // Getters
  const filteredRockets = computed(() => {
    let filtered = rockets.value

    // Filter by search
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(rocket => {
        const name = rocket.name?.toLowerCase() || ''
        const description = rocket.description?.toLowerCase() || ''
        const country = rocket.country?.toLowerCase() || ''
        const company = rocket.company?.toLowerCase() || ''
        return name.includes(searchLower) || description.includes(searchLower) ||
               country.includes(searchLower) || company.includes(searchLower)
      })
    }

    // Filter by active status
    if (filters.value.active !== null) {
      filtered = filtered.filter(rocket => rocket.active === filters.value.active)
    }

    return filtered
  })

  const countries = computed(() => {
    const uniqueCountries = new Set(rockets.value.map(r => r.country))
    return Array.from(uniqueCountries).filter(Boolean).sort()
  })

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null
    try {
      rockets.value = await rocketApi.getRockets()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch launches'
      console.error('Error fetching launches:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: string) {
    loading.value = true
    error.value = null
    try {
      // Check if it's a custom rocket (starts with 'custom-')
      if (id.startsWith('custom-')) {
        const customRocket = rockets.value.find(r => r.id === id)
        if (customRocket) {
          currentRocket.value = customRocket
        } else {
          throw new Error('Custom rocket not found')
        }
      } else {
        currentRocket.value = await rocketApi.getRocketById(id)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rocket details'
      console.error('Error fetching rocket:', err)
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    rockets.value.push(rocket)
  }

  function setFilters(newFilters: Partial<RocketFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      active: null,
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rockets,
    currentRocket,
    loading,
    error,
    filters,
    // Getters
    filteredRockets,
    countries,
    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilters,
    resetFilters,
    clearError,
  }
})
