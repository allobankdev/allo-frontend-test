import { ref, computed } from 'vue'
import type { Rocket, FetchStatus } from '@/types/rocket'
import { fetchRockets as apiFetchRockets, fetchRocketById as apiFetchRocketById } from '@/services/api'

// Shared singleton reactive state
const rockets = ref<Rocket[]>([])
const customRockets = ref<Rocket[]>([])
const status = ref<FetchStatus>('idle')
const error = ref<string | null>(null)

// Filter & search states
const searchQuery = ref('')
const selectedCountry = ref<string>('all')
const sortBy = ref<'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'date-desc' | 'date-asc'>('name-asc')

export function useRockets() {
  const allRockets = computed<Rocket[]>(() => {
    // Custom rockets listed first or merged seamlessly
    return [...customRockets.value, ...rockets.value]
  })

  const availableCountries = computed<string[]>(() => {
    const countries = new Set<string>()
    for (const r of allRockets.value) {
      if (r.manufacturer?.country_code) {
        countries.add(r.manufacturer.country_code.toUpperCase())
      }
    }
    return Array.from(countries).sort()
  })

  const filteredRockets = computed<Rocket[]>(() => {
    let list = [...allRockets.value]

    // Search query filter (matches name, full_name, or description)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(r =>
        (r.full_name && r.full_name.toLowerCase().includes(q)) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
      )
    }

    // Country filter
    if (selectedCountry.value && selectedCountry.value !== 'all') {
      list = list.filter(r =>
        r.manufacturer?.country_code?.toUpperCase() === selectedCountry.value.toUpperCase()
      )
    }

    // Sort order
    list.sort((a, b) => {
      switch (sortBy.value) {
        case 'name-asc':
          return (a.full_name || '').localeCompare(b.full_name || '')
        case 'name-desc':
          return (b.full_name || '').localeCompare(a.full_name || '')
        case 'cost-asc': {
          const costA = a.launch_cost ? Number(a.launch_cost) : Number.POSITIVE_INFINITY
          const costB = b.launch_cost ? Number(b.launch_cost) : Number.POSITIVE_INFINITY
          return costA - costB
        }
        case 'cost-desc': {
          const costA = a.launch_cost ? Number(a.launch_cost) : -1
          const costB = b.launch_cost ? Number(b.launch_cost) : -1
          return costB - costA
        }
        case 'date-desc': {
          const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : 0
          const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : 0
          return dateB - dateA
        }
        case 'date-asc': {
          const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : Number.POSITIVE_INFINITY
          const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : Number.POSITIVE_INFINITY
          return dateA - dateB
        }
        default:
          return 0
      }
    })

    return list
  })

  async function loadRockets(force = false) {
    if (!force && rockets.value.length > 0 && status.value === 'success') {
      return
    }

    status.value = 'loading'
    error.value = null

    try {
      const data = await apiFetchRockets()
      rockets.value = data
      status.value = 'success'
    } catch (err: unknown) {
      status.value = 'error'
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred while fetching rockets.'
    }
  }

  async function getRocketById(id: string | number): Promise<Rocket | null> {
    const stringId = String(id)

    // Check custom rockets first
    const foundCustom = customRockets.value.find(r => String(r.id) === stringId)
    if (foundCustom) return foundCustom

    // Check loaded rockets list
    const foundLoaded = rockets.value.find(r => String(r.id) === stringId)
    if (foundLoaded) return foundLoaded

    // Fallback: Fetch directly from API if not loaded or accessed by direct link
    try {
      const data = await apiFetchRocketById(id)
      return data
    } catch {
      return null
    }
  }

  function addRocket(newRocketData: Omit<Rocket, 'id'>) {
    const newRocket: Rocket = {
      ...newRocketData,
      id: `custom_${Date.now()}`,
      is_custom: true,
    }
    customRockets.value = [newRocket, ...customRockets.value]
    return newRocket
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedCountry.value = 'all'
    sortBy.value = 'name-asc'
  }

  return {
    rockets,
    customRockets,
    allRockets,
    filteredRockets,
    availableCountries,
    status,
    error,
    searchQuery,
    selectedCountry,
    sortBy,
    loadRockets,
    getRocketById,
    addRocket,
    resetFilters,
  }
}
