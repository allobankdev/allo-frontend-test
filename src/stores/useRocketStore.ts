import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { fetchRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

const LOCAL_STORAGE_KEY = 'allo:local-rockets'

function loadLocalRockets (): Rocket[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export type ActiveFilter = 'all' | 'active' | 'inactive'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>(loadLocalRockets())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const activeFilter = ref<ActiveFilter>('all')

  const allRockets = computed(() => [...localRockets.value, ...rockets.value])

  const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    return allRockets.value.filter(rocket => {
      const matchesSearch =
        !query ||
        rocket.name.toLowerCase().includes(query) ||
        rocket.description.toLowerCase().includes(query)
      const matchesActive =
        activeFilter.value === 'all' ||
        (activeFilter.value === 'active' && rocket.active) ||
        (activeFilter.value === 'inactive' && !rocket.active)
      return matchesSearch && matchesActive
    })
  })

  watch(
    localRockets,
    value => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
      } catch {
        // storage may be full or unavailable — fail silently
      }
    },
    { deep: true },
  )

  async function loadRockets () {
    loading.value = true
    error.value = null
    try {
      rockets.value = await fetchRockets()
    } catch {
      error.value = 'Failed to load rockets. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function addRocket (data: Omit<Rocket, 'id' | 'isLocal'>) {
    localRockets.value.unshift({
      ...data,
      id: `local-${Date.now()}`,
      isLocal: true,
    })
  }

  function findById (id: string): Rocket | undefined {
    return allRockets.value.find(r => r.id === id)
  }

  return {
    rockets,
    localRockets,
    allRockets,
    filteredRockets,
    loading,
    error,
    searchQuery,
    activeFilter,
    loadRockets,
    addRocket,
    findById,
  }
})
