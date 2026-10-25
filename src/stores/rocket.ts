import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getRockets } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const allRockets = computed(() => [
    ...localRockets.value,
    ...rockets.value,
  ])

  const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) {
      return allRockets.value
    }

    return allRockets.value.filter((rocket) =>
      rocket.full_name
        ?.toLowerCase()
        .includes(query),
    )
  })

  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      rockets.value = await getRockets()
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : 'Failed to load rockets.'
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket)
  }

  function getLocalRocketById(id: string | number) {
    return localRockets.value.find(
      rocket => String(rocket.id) === String(id),
    )
  }

  return {
    rockets,
    localRockets,
    loading,
    error,
    searchQuery,
    allRockets,
    filteredRockets,
    fetchRockets,
    addRocket,
    getLocalRocketById,
  }
})