import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { RocketService } from '@/api/rocketService'
import type { RocketDTO } from '@/types/rocket'
// We use Partial<RocketDTO> as the input parameter for simulated creation
// No need to import non-existent types

// Best practice: Explicitly define the status filter type
export type RocketStatusFilter = 'all' | 'active' | 'inactive'

export const useRocketStore = defineStore('rocket', () => {
  // --- LIST STATE ---
  const rockets = ref<RocketDTO[]>([])
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  // --- FILTER STATE ---
  const searchQuery = ref('')
  const statusFilter = ref<RocketStatusFilter>('all')

  // --- COMPUTED: UI Projection ---
  const filteredRockets = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    
    return rockets.value.filter(rocket => {
      const matchesSearch = query === '' || rocket.name.toLowerCase().includes(query)
      
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

  // --- ACTIONS ---

  const fetchRockets = async (options = { forceRefresh: false }) => {
    // Avoid refetching if already loaded, unless forced
    if (!options.forceRefresh && rockets.value.length > 0) return

    isLoading.value = true
    isError.value = null
    
    try {
      const response = await RocketService.getAllRockets()
      rockets.value = response.data
    } catch (error: unknown) {
      // Type-safe error handling without 'any'
      if (axios.isAxiosError(error)) {
        isError.value = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        isError.value = error.message
      } else {
        isError.value = 'Failed to load rocket fleet.'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single rocket with smart caching
  const fetchRocketById = async (id: string, options = { forceRefresh: false }) => {
    detailError.value = null
    
    // Check memory cache first, unless forced to bypass
    if (!options.forceRefresh) {
      const cached = rockets.value.find(r => r.id === id)
      if (cached) {
        selectedRocket.value = cached
        return
      }
    }

    // Fallback to API
    isDetailLoading.value = true
    try {
      const response = await RocketService.getRocketById(id)
      selectedRocket.value = response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        detailError.value = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        detailError.value = error.message
      } else {
        detailError.value = 'Failed to load rocket details.'
      }
    } finally {
      isDetailLoading.value = false
    }
  }

  // Prevent UI flashing on next visit
  const clearSelectedRocket = () => {
    selectedRocket.value = null
    detailError.value = null
  }

  // Simulate adding a new rocket using strict form payload
  const addSimulatedRocket = (rocketData: Partial<RocketDTO>) => {
    const newRocket: RocketDTO = {
      // Map mapped form inputs
      name: rocketData.name ?? 'Unknown Rocket',
      country: rocketData.country ?? 'Unknown',
      cost_per_launch: rocketData.cost_per_launch ?? 0,
      active: rocketData.active ?? true,
      description: rocketData.description ?? '',
      
      // Auto-generate the rest with dummy data to satisfy TS
      id: `sim-${Date.now()}`, 
      type: 'simulated_rocket',
      company: 'SpaceX', // REQUIRED by RocketDTO
      flickr_images: ['https://via.placeholder.com/400x300?text=New+Rocket'],
      height: { meters: 0, feet: 0 },
      diameter: { meters: 0, feet: 0 },
      mass: { kg: 0, lb: 0 },
      engines: { 
        type: 'unknown', 
        version: '', 
        layout: '', 
        propellant_1: 'unknown', 
        propellant_2: 'unknown', 
        thrust_to_weight: 0 
      },
      first_flight: new Date().toISOString().split('T')[0],
      success_rate_pct: 0
    }

    // Prepend to array so it appears first in the list
    rockets.value = [newRocket, ...rockets.value]
    
    // Clear the global error state so the UI switches back to the Grid view
    isError.value = null
  }

  return { 
    // State
    rockets, isLoading, isError, 
    searchQuery, statusFilter, 
    selectedRocket, isDetailLoading, detailError,
    // Getters
    filteredRockets,
    // Actions
    fetchRockets, fetchRocketById, clearSelectedRocket, addSimulatedRocket
  }
})