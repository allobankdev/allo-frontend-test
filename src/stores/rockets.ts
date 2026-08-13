import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LauncherListResponse, NewRocketInput, RequestStatus, Rocket } from '@/types/rocket'

const API_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref<string | null>(null)

  const isLoaded = computed(() => status.value === 'success' && rockets.value.length > 0)

  async function fetchRockets (force = false) {
    if (isLoaded.value && !force) return

    status.value = 'loading'
    errorMessage.value = null

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }

      const data: LauncherListResponse = await response.json()
      rockets.value = data.results
      status.value = 'success'
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Unknown error occurred'
      status.value = 'error'
    }
  }

  function addRocket (input: NewRocketInput) {
    const newRocket: Rocket = {
      id: Date.now(),
      name: input.full_name,
      full_name: input.full_name,
      description: input.description,
      image_url: input.image_url,
      launch_cost: input.launch_cost,
      maiden_flight: input.maiden_flight,
      manufacturer: {
        name: 'Local addition',
        country_code: input.country_code,
      },
    }

    rockets.value = [newRocket, ...rockets.value]
  }

  function findById (id: number): Rocket | undefined {
    return rockets.value.find(r => r.id === id)
  }

  return {
    rockets,
    status,
    errorMessage,
    isLoaded,
    fetchRockets,
    addRocket,
    findById,
  }
})
