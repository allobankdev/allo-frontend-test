import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, NewRocketForm } from '@/types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const statusFilter = ref<'all' | 'active' | 'retired'>('all')

  const filteredRockets = computed(() => {
    return rockets.value.filter(rocket => {
      const q = searchQuery.value.toLowerCase()
      const matchesSearch =
        !q ||
        rocket.full_name.toLowerCase().includes(q) ||
        (rocket.description?.toLowerCase().includes(q) ?? false)

      const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value === 'active' && rocket.active) ||
        (statusFilter.value === 'retired' && !rocket.active)

      return matchesSearch && matchesStatus
    })
  })

  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/?manufacturer__name=SpaceX&mode=detailed&limit=20`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      rockets.value = data.results
    } catch (e) {
      error.value = 'Failed to load rockets. Please check your connection and try again.'
      console.error('fetchRockets error:', e)
    } finally {
      loading.value = false
    }
  }

  function addRocket(form: NewRocketForm) {
    rockets.value.unshift({
      id: Date.now(),
      full_name: form.full_name,
      description: form.description || null,
      image_url: form.image_url || null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
      active: true,
    })
  }

  return {
    rockets,
    loading,
    error,
    searchQuery,
    statusFilter,
    filteredRockets,
    fetchRockets,
    addRocket,
  }
})
