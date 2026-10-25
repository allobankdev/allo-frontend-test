import { defineStore } from "pinia"
import { ref, computed } from "vue"

export interface Rocket {
  id: number | string
  full_name?: string
  description?: string
  image_url?: string
  launch_cost?: number | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string
  }
  country?: string
}

const API_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const allRockets = computed(() => [...localRockets.value, ...rockets.value])

  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Gagal memuat data')
      }

      const data = await response.json()
      rockets.value = data.results
    } catch {
      error.value = 'Gagal memuat data roket!'
    } finally {
      loading.value = false
    }
  }

  function addLocalRocket(rocket: Omit<Rocket, 'id'>) {
    const newRocket: Rocket = {
      ...rocket,
      id: `local-${Date.now()}`
    }

    localRockets.value.push(newRocket)
  }

  function getRocketById(id: string | number) {
    return allRockets.value.find((r) => r.id == id)
  }

  return {
    rockets,
    localRockets,
    loading,
    error,
    allRockets,
    fetchRockets,
    addLocalRocket,
    getRocketById
  }
})
