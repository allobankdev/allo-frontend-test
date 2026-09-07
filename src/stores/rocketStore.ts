import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, CreateRocketDto, ApiRocketResponse, LoadingStatus } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const status = ref<LoadingStatus>('idle')
  const errorMessage = ref<string | null>(null)

  // Filters
  const searchQuery = ref<string>('')
  const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

  // Combined rockets list (locally added rockets appear first)
  const combinedRockets = computed<Rocket[]>(() => {
    return [...localRockets.value, ...apiRockets.value]
  })

  // Filtered rockets list
  const filteredRockets = computed<Rocket[]>(() => {
    return combinedRockets.value.filter((rocket) => {
      // Name filter (matches name or full_name)
      const q = searchQuery.value.trim().toLowerCase()
      const matchesSearch =
        !q ||
        rocket.name.toLowerCase().includes(q) ||
        (rocket.full_name && rocket.full_name.toLowerCase().includes(q)) ||
        (rocket.description && rocket.description.toLowerCase().includes(q))

      // Status filter
      let matchesStatus = true
      if (statusFilter.value === 'active') {
        matchesStatus = rocket.active === true
      } else if (statusFilter.value === 'inactive') {
        matchesStatus = rocket.active === false || rocket.active === null || rocket.active === undefined
      }

      return matchesSearch && matchesStatus
    })
  })

  // Fetch all SpaceX rockets from API
  async function fetchRockets(force = false) {
    if (status.value === 'loading') return
    if (apiRockets.value.length > 0 && !force && status.value === 'success') return

    status.value = 'loading'
    errorMessage.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`)
      if (!response.ok) {
        throw new Error(`Failed to load rockets (HTTP ${response.status})`)
      }
      const data: ApiRocketResponse = await response.json()
      apiRockets.value = data.results || []
      status.value = 'success'
    } catch (err: any) {
      status.value = 'error'
      errorMessage.value = err?.message || 'Failed to connect to Launch Library API. Please check your internet connection.'
      console.error('Error fetching SpaceX rockets:', err)
    }
  }

  // Fetch single rocket by ID (if direct route load or deep link)
  async function fetchRocketById(id: string | number): Promise<Rocket | null> {
    // 1. Check existing in store
    const existing = combinedRockets.value.find((r) => String(r.id) === String(id))
    if (existing) return existing

    // 2. If it's a local ID, return null if not found
    if (String(id).startsWith('local-')) return null

    // 3. Otherwise fetch from API
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`)
      if (!response.ok) {
        throw new Error(`Rocket with ID ${id} not found`)
      }
      const rocket: Rocket = await response.json()
      // Check if already in apiRockets
      const idx = apiRockets.value.findIndex((r) => String(r.id) === String(id))
      if (idx !== -1) {
        apiRockets.value[idx] = rocket
      } else {
        apiRockets.value.push(rocket)
      }
      return rocket
    } catch (err: any) {
      console.error(`Error fetching rocket ${id}:`, err)
      return null
    }
  }

  // Add new rocket locally
  function addRocket(dto: CreateRocketDto): Rocket {
    const newRocket: Rocket = {
      id: `local-${Date.now()}`,
      name: dto.name,
      full_name: dto.full_name || dto.name,
      description: dto.description || 'No description provided.',
      image_url: dto.image_url || null,
      launch_cost: dto.launch_cost ?? null,
      maiden_flight: dto.maiden_flight || null,
      active: dto.active ?? true,
      reusable: dto.reusable ?? false,
      manufacturer: {
        name: 'SpaceX',
        country_code: dto.country_code || 'USA',
      },
      is_local: true,
    }

    localRockets.value.unshift(newRocket)
    return newRocket
  }

  // Reset filters
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = 'all'
  }

  return {
    apiRockets,
    localRockets,
    status,
    errorMessage,
    searchQuery,
    statusFilter,
    combinedRockets,
    filteredRockets,
    fetchRockets,
    fetchRocketById,
    addRocket,
    resetFilters,
  }
})
