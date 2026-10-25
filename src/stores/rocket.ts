import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rocket } from '@/types/rocket'
import { getRockets } from '@/services/rocketService'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRockets(force = false) {
    if (rockets.value.length > 0 && !force) {
      return
    }

    loading.value = true
    error.value = null

    try {
      rockets.value = await getRockets()
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch rockets'
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    rockets.value.push(rocket)
  }

  function findRocketById(id: number) {
    return rockets.value.find((rocket) => rocket.id === id) ?? null
  }

  return {
    rockets,
    loading,
    error,
    fetchRockets,
    addRocket,
    findRocketById
  }
})
