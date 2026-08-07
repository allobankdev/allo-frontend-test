import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/client'

export const useRocketStore = defineStore('rocket', () => {
  // Server state storage
  const rockets = ref<any[]>([])
  
  // UI interaction states
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  // Fetch rockets from API
  const fetchRockets = async () => {
    isLoading.value = true
    isError.value = null
    try {
      const response = await apiClient.get('/rockets')
      rockets.value = response.data
    } catch (error: any) {
      isError.value = error.message || 'Failed to fetch rockets'
    } finally {
      isLoading.value = false
    }
  }

  return { rockets, isLoading, isError, fetchRockets }
})
