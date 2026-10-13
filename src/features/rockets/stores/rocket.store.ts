import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getRockets } from '../api/rocket-api'
import type { NewRocketInput, Rocket } from '../types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasLoaded = ref(false)

  const allRockets = computed(() => [...localRockets.value, ...rockets.value])

  async function fetchRockets (force = false) {
    if (hasLoaded.value && !force) return

    loading.value = true
    error.value = null

    try {
      const response = await getRockets()
      rockets.value = response.results
      hasLoaded.value = true
    } catch (requestError) {
      error.value = requestError instanceof Error
        ? requestError.message
        : 'Terjadi kesalahan saat mengambil data roket.'
    } finally {
      loading.value = false
    }
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      full_name: input.full_name.trim(),
      description: input.description.trim() || null,
      image_url: input.image_url.trim() || null,
      launch_cost: input.launch_cost.trim() || null,
      maiden_flight: input.maiden_flight || null,
      manufacturer: {
        name: 'Lokal',
        country_code: input.country_code.trim().toUpperCase() || null,
      },
      isLocal: true,
    }

    localRockets.value.unshift(rocket)
    return rocket
  }

  function findLocalRocket (id: string) {
    return localRockets.value.find(rocket => String(rocket.id) === id)
  }

  return {
    allRockets,
    loading,
    error,
    hasLoaded,
    fetchRockets,
    addRocket,
    findLocalRocket,
  }
})
