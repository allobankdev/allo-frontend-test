import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllRockets, getRocketById, type RocketApiResponse } from '@/services/spacex'

export interface Rocket {
  id: string;
  name: string;
  description: string;
  images: string[];
  country: string;
  costPerLaunch: number;
  firstFlight: string;
  isLocal?: boolean;
}

function mapApiToRocket(api: RocketApiResponse): Rocket {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    images: api.flickr_images?.length ? api.flickr_images : [],
    country: api.country,
    costPerLaunch: api.cost_per_launch,
    firstFlight: api.first_flight,
  }
}

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterText = ref('')

  const filteredRockets = computed(() => {
    if (!filterText.value) return rockets.value
    const q = filterText.value.toLowerCase()
    return rockets.value.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q)
    )
  })

  async function loadRockets() {
    loading.value = true
    error.value = null
    try {
      const data = await getAllRockets()
      rockets.value = data.map(mapApiToRocket)
    } catch (e: any) {
      error.value = e?.message ?? 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketIfNeeded(id: string) {
    const existing = rockets.value.find(r => r.id === id)
    if (existing) return existing

    loading.value = true
    error.value = null
    try {
      const data = await getRocketById(id)
      const mapped = mapApiToRocket(data)
      rockets.value.push(mapped)
      return mapped
    } catch (e: any) {
      error.value = e?.message ?? 'Unknown error'
      throw e
    } finally {
      loading.value = false
    }
  }

  function addRocket(payload: Omit<Rocket, 'id'>) {
    const id = `local-${Date.now()}`
    rockets.value.unshift({
      ...payload,
      id,
      isLocal: true,
    })
  }

  return {
    rockets,
    loading,
    error,
    filterText,
    filteredRockets,
    loadRockets,
    fetchRocketIfNeeded,
    addRocket,
  }
})
