import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  fetchRocketById,
  fetchRockets,
} from '@/services/rocketApi'

import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) {
      return rockets.value
    }

    return rockets.value.filter((rocket) => {
      const name = rocket.full_name?.toLowerCase() ?? ''
      const description = rocket.description?.toLowerCase() ?? ''

      return (
        name.includes(query) ||
        description.includes(query)
      )
    })
  })

  async function loadRockets() {
    loading.value = true
    error.value = null

    try {
      rockets.value = await fetchRockets()
    } catch (err) {
      console.error(err)

      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to load rockets.'
    } finally {
      loading.value = false
    }
  }

  async function getRocketById(
    id: string | number,
  ): Promise<Rocket | null> {
    const existingRocket = rockets.value.find(
      (rocket) => String(rocket.id) === String(id),
    )

    if (existingRocket) {
      return existingRocket
    }

    return await fetchRocketById(id)
  }

  function addRocket(rocket: Rocket) {
    rockets.value = [
      rocket,
      ...rockets.value,
    ]
  }

  function setSearchQuery(value: string) {
    searchQuery.value = value
  }

  return {
    rockets,
    loading,
    error,
    searchQuery,
    filteredRockets,
    loadRockets,
    getRocketById,
    addRocket,
    setSearchQuery,
  }
})