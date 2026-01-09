import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rocketApi } from '@/services/spacexApi'

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filter = ref('')

  // Helper function to filter problematic image URLs
  const filterImageUrls = (images) => {
    if (!images || !Array.isArray(images)) return []
    // Filter out imgur.com URLs due to SSL certificate issues
    return images.filter(url => !url.includes('imgur.com'))
  }

  // Computed
  const filteredRockets = computed(() => {
    if (!filter.value) {
      return rockets.value
    }

    const searchTerm = filter.value.toLowerCase()
    return rockets.value.filter(rocket => {
      const nameMatch = rocket.name?.toLowerCase().includes(searchTerm)
      const countryMatch = rocket.country?.toLowerCase().includes(searchTerm)
      return nameMatch || countryMatch
    })
  })

  const hasRockets = computed(() => rockets.value.length > 0)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      const data = await rocketApi.getAllRockets()
      // Filter out problematic image URLs
      rockets.value = data.map(rocket => ({
        ...rocket,
        flickr_images: filterImageUrls(rocket.flickr_images)
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error in fetchRockets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id) {
    const existingRocket = rockets.value.find(r => r.id === id)

    if (existingRocket) {
      return existingRocket
    }

    loading.value = true
    error.value = null

    try {
      const rocket = await rocketApi.getRocketById(id)
      // Filter out problematic image URLs
      const filteredRocket = {
        ...rocket,
        flickr_images: filterImageUrls(rocket.flickr_images)
      }
      rockets.value.push(filteredRocket)
      return filteredRocket
    } catch (err) {
      error.value = err.message
      console.error('Error in fetchRocketById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket) {
    const newRocket = {
      ...rocket,
      id: `custom-${Date.now()}`
    }
    rockets.value.unshift(newRocket)
  }

  function setFilter(value) {
    filter.value = value
  }

  function clearError() {
    error.value = null
  }

  function retryFetch() {
    clearError()
    return fetchRockets()
  }

  return {
    // State
    rockets,
    loading,
    error,
    filter,

    // Computed
    filteredRockets,
    hasRockets,
    hasError,

    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilter,
    clearError,
    retryFetch
  }
})
