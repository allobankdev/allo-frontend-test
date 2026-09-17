import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { fetchRocket, fetchRockets } from '@/services/rocketApi'
import { getErrorMessage, getRocketName } from '@/utils/rocket'
import type { LoadStatus, NewRocket, Rocket, RocketFilters } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref('')

  const selectedRocket = ref<Rocket | null>(null)
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref('')

  const filters = reactive<RocketFilters>({ search: '', active: 'all' })

  const rockets = computed(() => [...localRockets.value, ...remoteRockets.value])

  const counts = computed(() => {
    const active = rockets.value.filter(rocket => rocket.active).length
    return {
      all: rockets.value.length,
      active,
      retired: rockets.value.length - active,
      local: localRockets.value.length,
    }
  })

  const filteredRockets = computed(() => {
    const query = (filters.search ?? '').trim().toLowerCase()

    return rockets.value.filter(rocket => {
      const matchesQuery = !query
        || getRocketName(rocket).toLowerCase().includes(query)
        || (rocket.description ?? '').toLowerCase().includes(query)
      const matchesActive = filters.active === 'all'
        || (filters.active === 'active') === Boolean(rocket.active)

      return matchesQuery && matchesActive
    })
  })

  async function loadRockets () {
    listStatus.value = 'loading'
    listError.value = ''

    try {
      remoteRockets.value = await fetchRockets()
      listStatus.value = 'success'
    } catch (error) {
      listError.value = getErrorMessage(error)
      listStatus.value = 'error'
    }
  }

  async function loadRocket (id: number) {
    const cached = rockets.value.find(rocket => rocket.id === id)
    if (cached) {
      selectedRocket.value = cached
      detailStatus.value = 'success'
      return
    }

    selectedRocket.value = null
    detailStatus.value = 'loading'
    detailError.value = ''

    try {
      // Local rockets only live in memory, so a non-positive id cannot come from the API
      if (!Number.isInteger(id) || id <= 0) throw new Error('Rocket not found.')
      selectedRocket.value = await fetchRocket(id)
      detailStatus.value = 'success'
    } catch (error) {
      detailError.value = getErrorMessage(error)
      detailStatus.value = 'error'
    }
  }

  function addRocket (input: NewRocket): Rocket {
    const fullName = input.fullName.trim()
    const rocket: Rocket = {
      id: -Date.now(),
      name: fullName,
      full_name: fullName,
      description: input.description.trim() || null,
      image_url: input.imageUrl.trim() || null,
      launch_cost: input.launchCost.trim() || null,
      maiden_flight: input.maidenFlight || null,
      active: input.active,
      manufacturer: { country_code: input.countryCode.trim().toUpperCase() || null },
      isLocal: true,
    }

    localRockets.value.unshift(rocket)
    return rocket
  }

  function resetFilters () {
    filters.search = ''
    filters.active = 'all'
  }

  return {
    rockets,
    counts,
    filteredRockets,
    listStatus,
    listError,
    selectedRocket,
    detailStatus,
    detailError,
    filters,
    loadRockets,
    loadRocket,
    addRocket,
    resetFilters,
  }
})
