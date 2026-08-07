import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RocketService } from '@/api/rocketService'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  // Server state storage
  const rockets = ref<Rocket[]>([])
  
  // UI interaction states
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  // Fetch rockets using Service Layer
  const fetchRockets = async () => {
    isLoading.value = true
    isError.value = null
    try {
      const response = await RocketService.getAllRockets()
      rockets.value = response.data
    } catch (error: unknown) {
      isError.value = error instanceof Error ? error.message : 'Unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return { rockets, isLoading, isError, fetchRockets }
})
