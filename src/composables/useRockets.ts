import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '@/constants/api'
import { fetchRocketsList, fetchRocketById as apiFetchRocketById, RocketApiError } from '@/services/rocketService'
import type { Rocket, CreateRocketInput, SortOption } from '@/types/rocket'

function loadLocalRocketsFromStorage(): Rocket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_ROCKETS)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalRocketsToStorage(items: Rocket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_ROCKETS, JSON.stringify(items))
  } catch {
  }
}

const apiRockets = ref<Rocket[]>([])
const localRockets = ref<Rocket[]>(loadLocalRocketsFromStorage())
const loading = ref(false)
const error = ref<string | null>(null)
const filterQuery = ref('')
const countryFilter = ref<string>('ALL')
const sortBy = ref<SortOption>('DEFAULT')
const hasFetched = ref(false)

const allRockets = computed<Rocket[]>(() => {
  return [...localRockets.value, ...apiRockets.value]
})

const availableCountries = computed<string[]>(() => {
  const set = new Set<string>()
  allRockets.value.forEach((rocket) => {
    const code = rocket.manufacturer?.country_code?.trim()
    if (code) {
      set.add(code.toUpperCase())
    }
  })
  return Array.from(set).sort()
})

const filteredRockets = computed<Rocket[]>(() => {
  const query = filterQuery.value.toLowerCase().trim()
  let list = [...allRockets.value]

  if (query) {
    list = list.filter((rocket) => {
      const name = rocket.full_name?.toLowerCase() ?? ''
      const desc = rocket.description?.toLowerCase() ?? ''
      const manufacturer = rocket.manufacturer?.name?.toLowerCase() ?? ''
      return name.includes(query) || desc.includes(query) || manufacturer.includes(query)
    })
  }

  if (countryFilter.value !== 'ALL') {
    list = list.filter((rocket) => {
      const code = rocket.manufacturer?.country_code?.trim().toUpperCase() ?? ''
      return code === countryFilter.value.toUpperCase()
    })
  }

  if (sortBy.value === 'NAME_ASC') {
    list.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''))
  } else if (sortBy.value === 'NAME_DESC') {
    list.sort((a, b) => (b.full_name || '').localeCompare(a.full_name || ''))
  }

  return list
})

async function fetchRockets(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    const results = await fetchRocketsList()
    apiRockets.value = results
    hasFetched.value = true
  } catch (err: unknown) {
    if (err instanceof RocketApiError) {
      error.value = err.message
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Failed to load rocket fleet. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

async function fetchRocketById(id: number): Promise<Rocket | null> {
  const cached = allRockets.value.find((r) => r.id === id)
  if (cached) {
    return cached
  }

  if (id < 0) {
    return null
  }

  try {
    const data = await apiFetchRocketById(id)
    if (!apiRockets.value.some((r) => r.id === data.id)) {
      apiRockets.value = [...apiRockets.value, data]
    }
    return data
  } catch {
    return null
  }
}

function getNextLocalId(): number {
  if (localRockets.value.length === 0) return -1
  const minId = Math.min(...localRockets.value.map((r) => r.id))
  return minId < 0 ? minId - 1 : -1
}

function addRocket(rocketData: CreateRocketInput): Rocket {
  const newRocket: Rocket = {
    ...rocketData,
    id: getNextLocalId(),
  }

  const updated = [newRocket, ...localRockets.value]
  localRockets.value = updated
  saveLocalRocketsToStorage(updated)

  return newRocket
}

function resetFilters(): void {
  filterQuery.value = ''
  countryFilter.value = 'ALL'
  sortBy.value = 'DEFAULT'
}


export function useRockets() {
  return {

    rockets: allRockets,
    loading,
    error,
    filterQuery,
    countryFilter,
    sortBy,
    hasFetched,

    availableCountries,
    filteredRockets,

    fetchRockets,
    fetchRocketById,
    addRocket,
    resetFilters,
  }
}
