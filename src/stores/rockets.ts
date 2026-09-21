import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/api/rockets'
import type { FetchStatus, NewRocketInput, Rocket } from '@/types/rocket'

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const listStatus = ref<FetchStatus>('idle')
  const listError = ref<string | null>(null)

  const selectedRocket = ref<Rocket | null>(null)
  const detailStatus = ref<FetchStatus>('idle')
  const detailError = ref<string | null>(null)

  const filterQuery = ref('')
  let nextLocalId = -1

  const filteredRockets = computed(() => {
    const query = filterQuery.value.trim().toLowerCase()
    if (!query) return rockets.value

    return rockets.value.filter(rocket => {
      const name = rocket.full_name?.toLowerCase() ?? ''
      const description = rocket.description?.toLowerCase() ?? ''
      return name.includes(query) || description.includes(query)
    })
  })

  async function loadRockets () {
    listStatus.value = 'loading'
    listError.value = null

    try {
      const remoteRockets = await fetchRockets()
      const localRockets = rockets.value.filter(rocket => rocket.isLocal)
      rockets.value = [...localRockets, ...remoteRockets]
      listStatus.value = 'success'
    } catch (error) {
      listStatus.value = 'error'
      listError.value = error instanceof Error
        ? error.message
        : 'Unable to load rockets'
    }
  }

  async function loadRocketById (id: number) {
    detailStatus.value = 'loading'
    detailError.value = null
    selectedRocket.value = null

    const cached = rockets.value.find(rocket => rocket.id === id)
    if (cached) {
      selectedRocket.value = cached
      detailStatus.value = 'success'
      return
    }

    if (id < 0) {
      detailStatus.value = 'error'
      detailError.value = 'Rocket not found'
      return
    }

    try {
      selectedRocket.value = await fetchRocketById(id)
      detailStatus.value = 'success'
    } catch (error) {
      detailStatus.value = 'error'
      detailError.value = error instanceof Error
        ? error.message
        : 'Unable to load rocket details'
    }
  }

  function setFilterQuery (value: string) {
    filterQuery.value = value
  }

  function addRocket (input: NewRocketInput) {
    const rocket: Rocket = {
      id: nextLocalId--,
      full_name: input.full_name.trim() || null,
      description: input.description.trim() || null,
      image_url: input.image_url.trim() || null,
      launch_cost: input.launch_cost.trim() || null,
      maiden_flight: input.maiden_flight.trim() || null,
      manufacturer: {
        id: null,
        name: 'Local',
        country_code: input.country_code.trim() || null,
      },
      isLocal: true,
    }

    rockets.value = [rocket, ...rockets.value]
  }

  function clearSelectedRocket () {
    selectedRocket.value = null
    detailStatus.value = 'idle'
    detailError.value = null
  }

  function setDetailError (message: string) {
    selectedRocket.value = null
    detailStatus.value = 'error'
    detailError.value = message
  }

  return {
    rockets,
    listStatus,
    listError,
    selectedRocket,
    detailStatus,
    detailError,
    filterQuery,
    filteredRockets,
    loadRockets,
    loadRocketById,
    setFilterQuery,
    addRocket,
    clearSelectedRocket,
    setDetailError,
  }
})
