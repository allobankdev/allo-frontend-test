import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocket, fetchRockets } from '../api/rocketApi'
import { getErrorMessage } from '../utils/format'
import { STATUS, type Status } from '../types/status'
import type { NewRocketInput, Rocket } from '../types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  // List state
  const rockets = ref<Rocket[]>([])
  const listStatus = ref<Status>(STATUS.IDLE)
  const listError = ref('')
  const query = ref('')

  // Detail state
  const selected = ref<Rocket | null>(null)
  const detailStatus = ref<Status>(STATUS.IDLE)
  const detailError = ref('')
  let detailRequestId = 0

  const filteredRockets = computed<Rocket[]>(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return rockets.value
    return rockets.value.filter(
      (rocket) => rocket.name.toLowerCase().includes(term) || rocket.description.toLowerCase().includes(term),
    )
  })

  async function loadRockets(): Promise<void> {
    if (listStatus.value === STATUS.LOADING) return
    listStatus.value = STATUS.LOADING
    listError.value = ''
    try {
      const remote = await fetchRockets()
      const local = rockets.value.filter((rocket) => rocket.isLocal) // keep rockets added by the user
      rockets.value = [...local, ...remote]
      listStatus.value = STATUS.SUCCESS
    } catch (error) {
      listError.value = getErrorMessage(error)
      listStatus.value = STATUS.ERROR
    }
  }

  function addRocket(input: NewRocketInput): void {
    rockets.value.unshift({
      id: `local-${Date.now()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      launchCost: input.launchCost === '' ? null : input.launchCost,
      country: input.country.trim(),
      maidenFlight: input.maidenFlight,
      isLocal: true,
    })
  }

  async function loadRocket(id: string): Promise<void> {
    const requestId = ++detailRequestId
    const cached = rockets.value.find((rocket) => rocket.id === id)
    if (cached) {
      selected.value = cached
      detailStatus.value = STATUS.SUCCESS
      return
    }
    selected.value = null
    detailStatus.value = STATUS.LOADING
    detailError.value = ''
    try {
      const rocket = await fetchRocket(id)
      if (requestId !== detailRequestId) return // a newer request replaced this one
      selected.value = rocket
      detailStatus.value = STATUS.SUCCESS
    } catch (error) {
      if (requestId !== detailRequestId) return
      detailError.value = getErrorMessage(error)
      detailStatus.value = STATUS.ERROR
    }
  }

  return {
    rockets, listStatus, listError, query, filteredRockets, loadRockets, addRocket,
    selected, detailStatus, detailError, loadRocket,
  }
})
