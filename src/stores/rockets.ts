import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getRocketById, getRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])

  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  async function loadRockets() {
    isLoading.value = true
    errorMessage.value = null

    try {
      const apiRockets = await getRockets()

      rockets.value = [
        ...localRockets.value,
        ...apiRockets,
      ]
    } catch {
      errorMessage.value = 'Unable to load rockets. Please try again.'

      // Keep locally added rockets even if API fails.
      rockets.value = [...localRockets.value]
    } finally {
      isLoading.value = false
    }
  }

  async function getRocket(id: number): Promise<Rocket> {
    const localRocket = localRockets.value.find(
      (rocket) => rocket.id === id
    )

    if (localRocket) {
      return localRocket
    }

    return getRocketById(id)
  }

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket)
    rockets.value.unshift(rocket)
  }

  const rocketCount = computed(() => rockets.value.length)

  return {
    rockets,
    isLoading,
    errorMessage,
    rocketCount,
    loadRockets,
    getRocket,
    addRocket,
  }
})