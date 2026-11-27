import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/api/rockets'
import type { NewRocketPayload, RequestStatus, Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  const apiRockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])

  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)

  const selectedRocket = ref<Rocket | null>(null)
  const detailStatus = ref<RequestStatus>('idle')
  const detailError = ref<string | null>(null)

  const allRockets = computed<Rocket[]>(() => [
    ...customRockets.value,
    ...apiRockets.value,
  ])

  const availableFamilies = computed<string[]>(() => {
    const families = new Set<string>()
    for (const rocket of allRockets.value) {
      if (rocket.family?.trim()) {
        families.add(rocket.family.trim())
      }
    }
    return Array.from(families).sort()
  })

  async function loadRockets (force = false) {
    if (!force && listStatus.value === 'success' && apiRockets.value.length > 0) {
      return
    }

    listStatus.value = 'loading'
    listError.value = null

    try {
      apiRockets.value = await fetchRockets()
      listStatus.value = 'success'
    } catch (error) {
      listStatus.value = 'error'
      listError.value = error instanceof Error
        ? error.message
        : 'Failed to load rockets. Please try again.'
    }
  }

  async function loadRocketById (id: number) {
    detailError.value = null

    const existing = allRockets.value.find(rocket => rocket.id === id)
    if (existing) {
      selectedRocket.value = existing
      detailStatus.value = 'success'
      return
    }

    detailStatus.value = 'loading'
    selectedRocket.value = null

    try {
      selectedRocket.value = await fetchRocketById(id)
      detailStatus.value = 'success'
    } catch (error) {
      detailStatus.value = 'error'
      detailError.value = error instanceof Error
        ? error.message
        : 'Failed to load rocket detail. Please try again.'
    }
  }

  function addRocket (payload: NewRocketPayload): Rocket {
    const newRocket: Rocket = {
      id: Date.now(),
      full_name: payload.full_name.trim(),
      description: payload.description.trim() || null,
      image_url: payload.image_url?.trim() || null,
      launch_cost: payload.launch_cost?.trim() || null,
      maiden_flight: payload.maiden_flight?.trim() || null,
      family: payload.family?.trim() || null,
      active: payload.active,
      manufacturer: {
        name: 'SpaceX',
        country_code: payload.country_code?.trim() || null,
      },
      isLocal: true,
    }

    customRockets.value.unshift(newRocket)
    return newRocket
  }

  return {
    apiRockets,
    customRockets,
    allRockets,
    availableFamilies,
    listStatus,
    listError,
    selectedRocket,
    detailStatus,
    detailError,
    loadRockets,
    loadRocketById,
    addRocket,
  }
})