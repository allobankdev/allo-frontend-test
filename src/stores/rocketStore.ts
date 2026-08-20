import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchRockets, fetchRocketById } from '@/services/spaceXApi'

export interface Rocket {
  id: string
  name: string
  type: string
  description: string
  cost_per_launch: number
  country: string
  first_flight: string
  rocket_id: string
  flickr_images: string[]
}

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterQuery = ref('')

  const allRockets = computed(() => {
    const combined = [...rockets.value, ...customRockets.value]
    if (!filterQuery.value) return combined
    return combined.filter(rocket =>
      rocket.name.toLowerCase().includes(filterQuery.value.toLowerCase()) ||
      rocket.description.toLowerCase().includes(filterQuery.value.toLowerCase())
    )
  })

  const loadRockets = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await fetchRockets()
      rockets.value = data.map(rocket => ({
        id: rocket.id,
        name: rocket.name,
        type: rocket.type,
        description: rocket.description,
        cost_per_launch: rocket.cost_per_launch,
        country: rocket.country,
        first_flight: rocket.first_flight,
        rocket_id: rocket.rocket_id,
        flickr_images: rocket.flickr_images || [],
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load rockets'
    } finally {
      loading.value = false
    }
  }

  const loadRocketDetail = async (rocketId: string) => {
    loading.value = true
    error.value = null
    try {
      if (rocketId.startsWith('custom-')) {
        const customRocket = customRockets.value.find(r => r.id === rocketId)
        if (customRocket) {
          selectedRocket.value = customRocket
        } else {
          error.value = 'Rocket not found'
        }
      } else {
        const rocketDetail = await fetchRocketById(rocketId)
        selectedRocket.value = {
          id: rocketDetail.id,
          name: rocketDetail.name,
          type: rocketDetail.type,
          description: rocketDetail.description,
          cost_per_launch: rocketDetail.cost_per_launch,
          country: rocketDetail.country,
          first_flight: rocketDetail.first_flight,
          rocket_id: rocketDetail.rocket_id,
          flickr_images: rocketDetail.flickr_images || [],
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load rocket detail'
    } finally {
      loading.value = false
    }
  }

  const addRocket = (rocket: Rocket) => {
    customRockets.value.push({
      ...rocket,
      id: `custom-${Date.now()}`,
      rocket_id: `custom-${Date.now()}`,
    })
  }

  const setFilterQuery = (query: string) => {
    filterQuery.value = query
  }

  const clearError = () => {
    error.value = null
  }

  const retry = () => {
    if (selectedRocket.value) {
      loadRocketDetail(selectedRocket.value.id)
    } else {
      loadRockets()
    }
  }

  return {
    rockets,
    customRockets,
    selectedRocket,
    loading,
    error,
    filterQuery,
    allRockets,
    loadRockets,
    loadRocketDetail,
    addRocket,
    setFilterQuery,
    clearError,
    retry,
  }
})
