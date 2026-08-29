/**
 * stores/rockets.ts
 *
 * Pinia store for managing rockets data
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  height: {
    meters: number
    feet: number
  }
  diameter: {
    meters: number
    feet: number
  }
  mass: {
    kg: number
    lb: number
  }
  stages: number
  boosters: number
  success_rate_pct: number
  active: boolean
  company: string
  wikipedia: string
}

export interface RocketFilters {
  query: string
  status: string
  country: string | null
}

export const useRocketsStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<RocketFilters>({
    query: '',
    status: 'all',
    country: null,
  })

  // Getters
  const allRockets = computed(() => [...rockets.value, ...customRockets.value])

  const filteredRockets = computed(() => {
    let result = allRockets.value

    // Filter by search query
    if (filters.value.query) {
      const query = filters.value.query.toLowerCase()
      result = result.filter(
        (rocket) =>
          rocket.name.toLowerCase().includes(query) ||
          rocket.description.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filters.value.status === 'active') {
      result = result.filter((rocket) => rocket.active)
    } else if (filters.value.status === 'inactive') {
      result = result.filter((rocket) => !rocket.active)
    }

    // Filter by country
    if (filters.value.country) {
      result = result.filter((rocket) => rocket.country === filters.value.country)
    }

    return result
  })

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<Rocket[]>(`${API_BASE_URL}/rockets`)
      rockets.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rockets'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: string): Promise<Rocket | null> {
    // Check custom rockets first
    const customRocket = customRockets.value.find((r) => r.id === id)
    if (customRocket) return customRocket

    // Check cached rockets
    const cachedRocket = rockets.value.find((r) => r.id === id)
    if (cachedRocket) return cachedRocket

    // Fetch from API
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<Rocket>(`${API_BASE_URL}/rockets/${id}`)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rocket'
      throw err
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Omit<Rocket, 'id'>) {
    const newRocket: Rocket = {
      ...rocket,
      id: `custom-${Date.now()}`,
    }
    customRockets.value.push(newRocket)
    return newRocket
  }

  function setFilters(newFilters: Partial<RocketFilters>) {
    filters.value = { ...filters.value, ...newFilters }
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
    filters,
    // Getters
    allRockets,
    filteredRockets,
    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilters,
    clearError,
  }
})
