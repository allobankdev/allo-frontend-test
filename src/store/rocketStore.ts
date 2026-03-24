import { computed, reactive, readonly } from 'vue'
import { getRockets } from '@/services/rocketService'
import type { Rocket, UiStatus } from '@/types/rocket'

interface RocketStoreState {
  remoteRockets: Rocket[]
  localRockets: Rocket[]
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

export interface UpdateRocketPayload extends CreateRocketPayload {
  id: string
}

const state = reactive<RocketStoreState>({
  remoteRockets: [],
  localRockets: [],
  filterKeyword: '',
  selectedRocketId: null,
  status: 'idle',
  error: null,
})

const rockets = computed(() => {
  return [...state.localRockets, ...state.remoteRockets]
})

const isLoading = computed(() => state.status === 'loading')

const filteredRockets = computed(() => {
  const keyword = state.filterKeyword.trim().toLowerCase()
  if (!keyword) return rockets.value

  return rockets.value.filter((rocket) => {
    return (
      rocket.name.toLowerCase().includes(keyword) ||
      rocket.description.toLowerCase().includes(keyword)
    )
  })
})

const selectedRocket = computed(() => {
  if (!state.selectedRocketId) return null
  return rockets.value.find((rocket) => rocket.id === state.selectedRocketId) ?? null
})

async function fetchRockets() {
  state.status = 'loading'
  state.error = null

  try {
    state.remoteRockets = await getRockets()
    state.status = 'success'
  } catch (error) {
    state.status = 'error'
    state.error = toFriendlyErrorMessage(error)
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

  state.localRockets = [localRocket, ...state.localRockets]
}

function updateRocket(payload: UpdateRocketPayload) {
  const normalize = (rocket: Rocket): Rocket => {
    return {
      ...rocket,
      name: payload.name.trim(),
      description: payload.description.trim(),
      image: payload.image?.trim() || null,
      images: payload.image?.trim() ? [payload.image.trim()] : rocket.images,
      costPerLaunch: payload.costPerLaunch ?? 0,
      country: payload.country?.trim() || 'Unknown',
      firstFlight: payload.firstFlight?.trim() || rocket.firstFlight,
    }
  }

  const localIndex = state.localRockets.findIndex((rocket) => rocket.id === payload.id)
  if (localIndex >= 0) {
    const nextLocalRockets = [...state.localRockets]
    nextLocalRockets[localIndex] = normalize(nextLocalRockets[localIndex])
    state.localRockets = nextLocalRockets
    return
  }

  const remoteIndex = state.remoteRockets.findIndex((rocket) => rocket.id === payload.id)
  if (remoteIndex >= 0) {
    const nextRemoteRockets = [...state.remoteRockets]
    nextRemoteRockets[remoteIndex] = normalize(nextRemoteRockets[remoteIndex])
    state.remoteRockets = nextRemoteRockets
  }
}

function deleteRocket(id: string) {
  const previousLength = state.localRockets.length + state.remoteRockets.length
  state.localRockets = state.localRockets.filter((rocket) => rocket.id !== id)
  state.remoteRockets = state.remoteRockets.filter((rocket) => rocket.id !== id)

  const currentLength = state.localRockets.length + state.remoteRockets.length
  if (currentLength < previousLength && state.selectedRocketId === id) {
    state.selectedRocketId = null
  }
}

function setSelectedRocketById(id: string | null) {
  state.selectedRocketId = id
}

export function useRocketStore() {
  return {
    state: readonly(state),
    rockets,
    filteredRockets,
    selectedRocket,
    isLoading,
    fetchRockets,
    retryFetchRockets,
    setFilter,
    addRocket,
    updateRocket,
    deleteRocket,
    setSelectedRocketById,
  }
}

function toFriendlyErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Gagal memuat data rocket. Silakan coba lagi.'

  const message = error.message.toLowerCase()
  if (message.includes('failed to fetch')) {
    return 'Gagal memuat data rocket. Periksa koneksi internet lalu coba lagi.'
  }

  return error.message
}
