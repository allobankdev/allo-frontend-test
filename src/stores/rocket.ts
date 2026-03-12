import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { getRockets, getRocketById } from '@/services/api'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref('')

  const filteredRockets = computed(() => {
    if (!filter.value) return rockets.value
    const query = filter.value.toLowerCase()
    return rockets.value.filter(
      r => r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query),
    )
  })

  async function fetchRockets() {
    loading.value = true
    error.value = null
    try {
      rockets.value = await getRockets()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch rockets'
    } finally {
      loading.value = false
    }
  }

  async function fetchRocketById(id: string) {
    loading.value = true
    error.value = null
    try {
      selectedRocket.value = await getRocketById(id)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch rocket'
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    rockets.value.push(rocket)
  }

  function setFilter(text: string) {
    filter.value = text
  }

  return {
    rockets,
    selectedRocket,
    loading,
    error,
    filter,
    filteredRockets,
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilter,
  }
})
