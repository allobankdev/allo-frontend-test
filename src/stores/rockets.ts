/**
 * Rockets store – state management for rocket list, filter, and add
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchRockets } from '@/api/spacex'
import type { Rocket, RocketInput } from '@/types/rocket'

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const filterQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredRockets = computed(() => {
    const q = filterQuery.value.trim().toLowerCase()
    if (!q) return rockets.value
    return rockets.value.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
    )
  })

  async function loadRockets() {
    loading.value = true
    error.value = null
    try {
      rockets.value = await fetchRockets()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load rockets'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setFilter(query: string) {
    filterQuery.value = query
  }

  function addRocket(input: RocketInput) {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: input.name,
      type: 'rocket',
      active: false,
      stages: 0,
      boosters: 0,
      cost_per_launch: input.cost_per_launch ?? null,
      success_rate_pct: null,
      first_flight: input.first_flight ?? null,
      country: input.country ?? '',
      company: 'Custom',
      description: input.description ?? null,
      wikipedia: null,
      flickr_images: ['https://imgur.com/DaCfMsj.jpg'],
    }
    rockets.value = [newRocket, ...rockets.value]
  }

  function getRocketById(id: string): Rocket | undefined {
    return rockets.value.find((r) => r.id === id)
  }

  return {
    rockets,
    filterQuery,
    loading,
    error,
    filteredRockets,
    loadRockets,
    setFilter,
    addRocket,
    getRocketById,
  }
})
