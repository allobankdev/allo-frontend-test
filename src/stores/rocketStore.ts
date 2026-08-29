import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch?: number
  country?: string
  first_flight?: string
  success_rate_pct?: number
  active?: boolean
  isLocal?: boolean
}

export const useRocketStore = defineStore('rocket', () => {
  const apiRockets = ref<Rocket[]>([])
  const isLoading = ref<boolean>(false)
  const errorMsg = ref<string | null>(null)
  const searchQuery = ref<string>('')

  const localRockets = ref<Rocket[]>((() => {
    try {
      const raw = localStorage.getItem('my_local_rockets')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })())

  const allRockets = computed(() => [...localRockets.value, ...apiRockets.value])

  const filteredRockets = computed(() => {
    if (!searchQuery.value) return allRockets.value
    const query = searchQuery.value.toLowerCase()
    return allRockets.value.filter(r => r.name.toLowerCase().includes(query))
  })

  function getRocketById(id: string): Rocket | undefined {
    return allRockets.value.find(r => r.id === id)
  }

  const fetchRockets = async () => {
    if (apiRockets.value.length > 0) return

    isLoading.value = true
    errorMsg.value = null

    try {
      const response = await axios.get('https://api.spacexdata.com/v4/rockets')
      apiRockets.value = response.data
    } catch (error: any) {
      errorMsg.value = error.message || 'Gagal mengambil data dari SpaceX.'
    } finally {
      isLoading.value = false
    }
  }

  const addLocalRocket = (newRocket: Omit<Rocket, 'id'>) => {
    const withId: Rocket = {
      ...newRocket,
      id: crypto.randomUUID(),
      isLocal: true,
      flickr_images: newRocket.flickr_images?.length
        ? newRocket.flickr_images
        : [],
    }
    localRockets.value.unshift(withId)
    try {
      localStorage.setItem('my_local_rockets', JSON.stringify(localRockets.value))
    } catch {
      console.warn('localStorage unavailable, rocket not persisted')
    }
  }

  return {
    apiRockets,
    localRockets,
    isLoading,
    errorMsg,
    searchQuery,
    allRockets,
    filteredRockets,
    getRocketById,
    fetchRockets,
    addLocalRocket,
  }
})
