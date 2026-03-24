import { computed, reactive, readonly } from 'vue'
import { getRockets } from '@/services/rocketService'
import type { Rocket, UiStatus } from '@/types/rocket'

interface RocketStoreState {
  rockets: Rocket[]
  filterKeyword: string
  selectedRocketId: string | null
  status: UiStatus
  error: string | null
}

export interface CreateRocketPayload {
  name: string
  description: string
  image?: string
  costPerLaunch?: number
  country?: string
  firstFlight?: string
}

const state = reactive<RocketStoreState>({
  rockets: [],
  filterKeyword: '',
  selectedRocketId: null,
  status: 'idle',
  error: null,
})

const filteredRockets = computed(() => {
  const keyword = state.filterKeyword.trim().toLowerCase()
  if (!keyword) return state.rockets

  return state.rockets.filter((rocket) => {
    return (
      rocket.name.toLowerCase().includes(keyword) ||
      rocket.description.toLowerCase().includes(keyword)
    )
  })
})

const selectedRocket = computed(() => {
  if (!state.selectedRocketId) return null
  return state.rockets.find((rocket) => rocket.id === state.selectedRocketId) ?? null
})

async function fetchRockets() {
  state.status = 'loading'
  state.error = null

  try {
    state.rockets = await getRockets()
    state.status = 'success'
  } catch (error) {
    state.status = 'error'
    state.error = error instanceof Error
      ? error.message
      : 'Failed to load rockets. Please try again.'
  }
}

async function retryFetchRockets() {
  await fetchRockets()
}

function setFilter(keyword: string) {
  state.filterKeyword = keyword
}

function addRocket(payload: CreateRocketPayload) {
  const now = new Date()
  const localRocket: Rocket = {
    id: `local-${now.getTime()}`,
    name: payload.name.trim(),
    description: payload.description.trim(),
    image: payload.image?.trim() || null,
    images: payload.image?.trim() ? [payload.image.trim()] : [],
    costPerLaunch: payload.costPerLaunch ?? 0,
    country: payload.country?.trim() || 'Unknown',
    firstFlight: payload.firstFlight?.trim() || now.toISOString().split('T')[0],
  }

  state.rockets = [localRocket, ...state.rockets]
}

function setSelectedRocketById(id: string | null) {
  state.selectedRocketId = id
}

export function useRocketStore() {
  return {
    state: readonly(state),
    filteredRockets,
    selectedRocket,
    fetchRockets,
    retryFetchRockets,
    setFilter,
    addRocket,
    setSelectedRocketById,
  }
}

