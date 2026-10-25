import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RocketLauncher, NewRocketInput } from '@/types/rocket'
import { fetchSpaceXRockets, fetchRocketById as fetchRocketApi } from '@/services/api'

const CUSTOM_ROCKETS_STORAGE_KEY = 'allo_custom_rockets'

export const useRocketStore = defineStore('rocket', () => {
  const apiRockets = ref<RocketLauncher[]>([])
  const customRockets = ref<RocketLauncher[]>([])
  const selectedRocket = ref<RocketLauncher | null>(null)
  
  const loading = ref(false)
  const detailLoading = ref(false)
  const error = ref<string | null>(null)
  const detailError = ref<string | null>(null)

  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'active' | 'retired'>('all')
  const familyFilter = ref<string>('all')

  // Load custom rockets from local storage
  function loadCustomRockets() {
    try {
      const stored = localStorage.getItem(CUSTOM_ROCKETS_STORAGE_KEY)
      if (stored) {
        customRockets.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse custom rockets from localStorage', e)
      customRockets.value = []
    }
  }

  // Combined rockets: user added first, then API rockets
  const allRockets = computed<RocketLauncher[]>(() => {
    return [...customRockets.value, ...apiRockets.value]
  })

  // List of unique families for filter dropdown
  const availableFamilies = computed<string[]>(() => {
    const families = new Set<string>()
    allRockets.value.forEach((r) => {
      if (r.family) {
        families.add(r.family)
      }
    })
    return Array.from(families).sort()
  })

  // Filtered rockets by search, status, and family
  const filteredRockets = computed<RocketLauncher[]>(() => {
    const q = searchQuery.value.trim().toLowerCase()

    return allRockets.value.filter((rocket) => {
      // Search matching (name, full_name, description)
      const matchesSearch =
        !q ||
        (rocket.name && rocket.name.toLowerCase().includes(q)) ||
        (rocket.full_name && rocket.full_name.toLowerCase().includes(q)) ||
        (rocket.description && rocket.description.toLowerCase().includes(q))

      // Status matching
      let matchesStatus = true
      if (statusFilter.value === 'active') {
        matchesStatus = rocket.active === true
      } else if (statusFilter.value === 'retired') {
        matchesStatus = rocket.active === false
      }

      // Family matching
      let matchesFamily = true
      if (familyFilter.value !== 'all') {
        matchesFamily = rocket.family === familyFilter.value
      }

      return matchesSearch && matchesStatus && matchesFamily
    })
  })

  // Fetch list of rockets from LL2 API
  async function fetchRockets(force = false) {
    if (apiRockets.value.length > 0 && !force) {
      return
    }

    loading.value = true
    error.value = null

    try {
      loadCustomRockets()
      const data = await fetchSpaceXRockets()
      apiRockets.value = data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load rockets. Please try again.'
    } finally {
      loading.value = false
    }
  }

  // Fetch single rocket by ID (or find from store)
  async function getRocketById(id: string | number, forceFetch = false): Promise<RocketLauncher | null> {
    detailError.value = null

    // First ensure custom rockets are loaded
    if (customRockets.value.length === 0) {
      loadCustomRockets()
    }

    // Check custom rockets first
    const customMatch = customRockets.value.find((r) => String(r.id) === String(id))
    if (customMatch) {
      selectedRocket.value = customMatch
      return customMatch
    }

    // Check in apiRockets if already loaded and not forcing fetch
    const cachedApiMatch = apiRockets.value.find((r) => String(r.id) === String(id))
    if (cachedApiMatch && !forceFetch) {
      selectedRocket.value = cachedApiMatch
      return cachedApiMatch
    }

    // Fetch from LL2 API
    detailLoading.value = true
    try {
      const rocket = await fetchRocketApi(id)
      selectedRocket.value = rocket
      // Also update in apiRockets if already loaded
      const idx = apiRockets.value.findIndex((r) => String(r.id) === String(id))
      if (idx !== -1) {
        apiRockets.value[idx] = rocket
      }
      return rocket
    } catch (err: unknown) {
      detailError.value = err instanceof Error ? err.message : 'Failed to load rocket details. Please try again.'
      selectedRocket.value = null
      return null
    } finally {
      detailLoading.value = false
    }
  }

  // Add new custom rocket
  function addRocket(input: NewRocketInput): RocketLauncher {
    const customId = `custom-${Date.now()}`
    const newRocket: RocketLauncher = {
      id: customId,
      name: input.full_name,
      full_name: input.full_name,
      description: input.description,
      image_url: input.image_url.trim() || null,
      launch_cost: input.launch_cost.trim() || null,
      maiden_flight: input.maiden_flight.trim() || null,
      active: input.active ?? true,
      family: input.family || 'Custom',
      is_custom: true,
      manufacturer: {
        name: 'SpaceX (Custom)',
        country_code: input.country_code.trim() || 'USA',
      },
    }

    customRockets.value.unshift(newRocket)
    try {
      localStorage.setItem(CUSTOM_ROCKETS_STORAGE_KEY, JSON.stringify(customRockets.value))
    } catch (e) {
      console.error('Failed to save custom rockets to localStorage', e)
    }

    return newRocket
  }

  return {
    apiRockets,
    customRockets,
    selectedRocket,
    loading,
    detailLoading,
    error,
    detailError,
    searchQuery,
    statusFilter,
    familyFilter,
    allRockets,
    availableFamilies,
    filteredRockets,
    fetchRockets,
    getRocketById,
    addRocket,
    loadCustomRockets,
  }
})
