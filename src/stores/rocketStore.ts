import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RocketService } from '@/api/rocketService'
import type { RocketDTO } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  // --- LIST STATE ---
  const rockets = ref<RocketDTO[]>([])
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  // --- DETAIL STATE ---
  const selectedRocket = ref<RocketDTO | null>(null)
  const isDetailLoading = ref(false)
  const detailError = ref<string | null>(null)

  // Fetch all rockets
  const fetchRockets = async () => {
    // Avoid refetching if already loaded
    if (rockets.value.length > 0) return

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

  // Fetch single rocket with smart caching
  const fetchRocketById = async (id: string) => {
    detailError.value = null
    
    // Check memory cache first
    const cached = rockets.value.find(r => r.id === id)
    if (cached) {
      selectedRocket.value = cached
      return
    }

    // Fallback to API
    isDetailLoading.value = true
    try {
      const response = await RocketService.getRocketById(id)
      selectedRocket.value = response.data
    } catch (error: unknown) {
      detailError.value = error instanceof Error ? error.message : 'Unknown error occurred'
    } finally {
      isDetailLoading.value = false
    }
  }

  return { 
    rockets, isLoading, isError, fetchRockets,
    selectedRocket, isDetailLoading, detailError, fetchRocketById 
  }
})
