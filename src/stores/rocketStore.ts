import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getRocketById, getRockets } from '@/services/rocketService'
import type { NewRocketInput, Rocket } from '@/types/rocket'

let localIdSequence = 0

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const detailLoading = ref(false)
  const detailError = ref<string | null>(null)

  const localCount = computed(() => rockets.value.filter(rocket => rocket.isLocal).length)

  function findRocket(id: string | number): Rocket | undefined {
    return rockets.value.find(rocket => String(rocket.id) === String(id))
  }

  function upsertRocket(rocket: Rocket) {
    const index = rockets.value.findIndex(item => String(item.id) === String(rocket.id))

    if (index >= 0) {
      rockets.value[index] = { ...rockets.value[index], ...rocket }
      return
    }

    rockets.value.push(rocket)
  }

  async function fetchRockets(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return

    loading.value = true
    error.value = null

    try {
      const data = await getRockets()
      const localRockets = rockets.value.filter(rocket => rocket.isLocal)

      rockets.value = [...data, ...localRockets]
      loaded.value = true
    } catch (err) {
      error.value = toErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: string | number, force = false): Promise<Rocket | undefined> {
    const cached = findRocket(id)

    if (cached && !force) {
      detailError.value = null
      return cached
    }

    detailLoading.value = true
    detailError.value = null

    try {
      const rocket = await getRocketById(id)
      upsertRocket(rocket)
      return rocket
    } catch (err) {
      detailError.value = toErrorMessage(err)
      return undefined
    } finally {
      detailLoading.value = false
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    const localRocket: Rocket = {
      id: Date.now() + localIdSequence++,
      name: input.name,
      full_name: input.name,
      description: input.description || null,
      image_url: input.image_url || null,
      launch_cost: input.launch_cost,
      maiden_flight: input.maiden_flight || null,
      manufacturer: {
        country_code: input.manufacturer_country || null,
      },
      isLocal: true,
    }

    rockets.value.unshift(localRocket)
    return localRocket
  }

  function clearError() {
    error.value = null
  }

  function clearDetailError() {
    detailError.value = null
  }

  return {
    rockets,
    loading,
    error,
    loaded,
    detailLoading,
    detailError,
    localCount,

    findRocket,
    fetchRockets,
    fetchRocketById,
    addRocket,
    clearError,
    clearDetailError,
  }
})
