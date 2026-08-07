import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { RocketService } from '@/api/rocketService'
import type { RocketDTO } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  // --- LIST STATE ---
  const rockets = ref<RocketDTO[]>([])
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  // --- FILTER STATE ---
  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

  // Computed state for UI projection
  const filteredRockets = computed(() => {
    return rockets.value.filter(rocket => {
      // 1. Check text match (case-insensitive)
      const matchesSearch = rocket.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      // 2. Check strict active status
      const matchesStatus = statusFilter.value === 'all' 
        || (statusFilter.value === 'active' && rocket.active)
        || (statusFilter.value === 'inactive' && !rocket.active)
      
      return matchesSearch && matchesStatus
    })
  })

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
    searchQuery, statusFilter, filteredRockets,
    selectedRocket, isDetailLoading, detailError, fetchRocketById 
  }
})
