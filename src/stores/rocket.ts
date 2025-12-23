/**
 * Rocket Store
 * Manages rocket state using Pinia
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket } from '@/services/spacexApi'
import { fetchRockets, fetchRocketById } from '@/services/spacexApi'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const loadingState = ref<LoadingState>('idle')
  const error = ref<string | null>(null)
  const filterQuery = ref<string>('')

  // Getters
  const filteredRockets = computed(() => {
    if (!filterQuery.value.trim()) {
      return rockets.value
    }
    
    const query = filterQuery.value.toLowerCase()
    return rockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(query) ||
      rocket.description.toLowerCase().includes(query) ||
      rocket.country.toLowerCase().includes(query)
    )
  })

  const isLoading = computed(() => loadingState.value === 'loading')
  const isError = computed(() => loadingState.value === 'error')
  const isSuccess = computed(() => loadingState.value === 'success')

  // Actions
  async function loadRockets() {
    loadingState.value = 'loading'
    error.value = null
    
    try {
      const data = await fetchRockets()
      rockets.value = data
      loadingState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load rockets'
      loadingState.value = 'error'
      throw err
    }
  }

  async function loadRocketById(id: string) {
    loadingState.value = 'loading'
    error.value = null
    
    try {
      const data = await fetchRocketById(id)
      selectedRocket.value = data
      loadingState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load rocket'
      loadingState.value = 'error'
      throw err
    }
  }

  function setFilterQuery(query: string) {
    filterQuery.value = query
  }

  function addRocket(rocket: Rocket) {
    rockets.value.push(rocket)
  }

  function clearSelectedRocket() {
    selectedRocket.value = null
  }

  return {
    // State
    rockets,
    selectedRocket,
    loadingState,
    error,
    filterQuery,
    // Getters
    filteredRockets,
    isLoading,
    isError,
    isSuccess,
    // Actions
    loadRockets,
    loadRocketById,
    setFilterQuery,
    addRocket,
    clearSelectedRocket,
  }
})

