import { ref, computed } from 'vue'
import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0'

const rockets = ref<Rocket[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const hasFetched = ref(false)

const STORAGE_KEY = 'spacex_local_rockets'

function getSavedLocalRockets(): Rocket[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveLocalRockets(localRockets: Rocket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localRockets))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export function useRockets() {
  const filterQuery = ref('')

  const filteredRockets = computed(() => {
    if (!filterQuery.value.trim()) return rockets.value
    const query = filterQuery.value.toLowerCase().trim()
    return rockets.value.filter(
      (rocket) =>
        rocket.full_name.toLowerCase().includes(query) ||
        (rocket.description && rocket.description.toLowerCase().includes(query))
    )
  })

  async function fetchRockets() {
    if (hasFetched.value && rockets.value.length > 0 && !error.value) return
    loading.value = true
    error.value = null
    try {
      const response = await fetch(
        `${API_BASE}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
      )
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      const data: RocketListResponse = await response.json()
      const savedLocals = getSavedLocalRockets()
      const existingLocalsInState = rockets.value.filter((r) => r.id < 0)
      const mergedLocalsMap = new Map<number, Rocket>()
      savedLocals.forEach((r) => mergedLocalsMap.set(r.id, r))
      existingLocalsInState.forEach((r) => mergedLocalsMap.set(r.id, r))
      const combinedLocals = Array.from(mergedLocalsMap.values())
      saveLocalRockets(combinedLocals)
      rockets.value = [...combinedLocals, ...data.results]
      hasFetched.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Omit<Rocket, 'id'>) {
    const currentLocals = rockets.value.filter((r) => r.id < 0)
    const minId = currentLocals.reduce((min, r) => Math.min(min, r.id), 0)
    const newId = minId <= 0 ? minId - 1 : -1
    const newRocket: Rocket = {
      ...rocket,
      id: newId,
    }
    const savedLocals = getSavedLocalRockets()
    const updatedLocals = [newRocket, ...savedLocals.filter((r) => r.id !== newId)]
    saveLocalRockets(updatedLocals)
    rockets.value = [newRocket, ...rockets.value]
  }

  function getRocketById(id: number): Rocket | undefined {
    return rockets.value.find((r) => r.id === id)
  }

  async function fetchRocketById(id: number): Promise<Rocket | undefined> {
    const existing = getRocketById(id)
    if (existing) return existing
    if (id < 0) return undefined

    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/config/launcher/${id}/`)
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      const data: Rocket = await response.json()
      if (!rockets.value.some((r) => r.id === data.id)) {
        rockets.value.push(data)
      }
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
      return undefined
    } finally {
      loading.value = false
    }
  }

  return {
    rockets,
    loading,
    error,
    filterQuery,
    filteredRockets,
    fetchRockets,
    fetchRocketById,
    addRocket,
    getRocketById,
  }
}
