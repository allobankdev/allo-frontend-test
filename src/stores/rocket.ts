import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchRocketById, fetchRockets } from '@/services/rocketService'
import type { AsyncStatus, NewRocketInput, Rocket } from '@/types/rocket'

export interface RocketFilter {
  search: string
  country: string | null
}

const STORAGE_KEY = 'allo_spacex_local_rockets'

function loadSavedRockets (): Rocket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistLocalRockets (rockets: Rocket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rockets))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export const useRocketStore = defineStore('rocket', () => {
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>(loadSavedRockets())
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)
  const filter = ref<RocketFilter>({ search: '', country: null })

  const allRockets = computed(() => [...localRockets.value, ...remoteRockets.value])

  const countries = computed(() =>
    [...new Set(allRockets.value.map(r => r.country).filter((c): c is string => !!c))].sort(),
  )

  const filteredRockets = computed(() => {
    const search = filter.value.search.trim().toLowerCase()
    return allRockets.value.filter(rocket => {
      const matchesSearch = !search
        || rocket.name.toLowerCase().includes(search)
        || (rocket.description?.toLowerCase().includes(search) ?? false)
      const matchesCountry = !filter.value.country || rocket.country === filter.value.country
      return matchesSearch && matchesCountry
    })
  })

  async function loadRockets (force = false) {
    if (!force && status.value === 'success') return
    status.value = 'loading'
    error.value = null
    try {
      remoteRockets.value = await fetchRockets()
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load rockets'
      status.value = 'error'
    }
  }

  function findRocket (id: string): Rocket | undefined {
    return allRockets.value.find(r => r.id === id)
  }

  async function getRocket (id: string): Promise<Rocket> {
    const cached = findRocket(id)
    if (cached) return cached
    if (id.startsWith('local-')) throw new Error('Rocket not found')
    return fetchRocketById(id)
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = { ...input, id: `local-${crypto.randomUUID()}`, isLocal: true }
    localRockets.value.unshift(rocket)
    persistLocalRockets(localRockets.value)
    return rocket
  }

  function resetFilter () {
    filter.value = { search: '', country: null }
  }

  return {
    status,
    error,
    filter,
    allRockets,
    countries,
    filteredRockets,
    loadRockets,
    getRocket,
    addRocket,
    resetFilter,
  }
})

