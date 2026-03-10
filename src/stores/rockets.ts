import { computed, reactive, readonly } from 'vue'

import { fetchRockets } from '@/services/spacex'
import type { RequestStatus, Rocket, RocketDraft } from '@/types/rocket'

const STORAGE_KEY = 'allo-bank-added-rockets'

interface RocketsState {
  apiRockets: Rocket[]
  customRockets: Rocket[]
  status: RequestStatus
  errorMessage: string
}

function readStoredRockets(): Rocket[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as Rocket[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

const state = reactive<RocketsState>({
  apiRockets: [],
  customRockets: readStoredRockets(),
  status: 'idle',
  errorMessage: '',
})

function persistCustomRockets() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customRockets))
}

async function loadRockets(force = false) {
  if (!force && (state.status === 'loading' || state.apiRockets.length > 0)) {
    return
  }

  state.status = 'loading'
  state.errorMessage = ''

  try {
    state.apiRockets = await fetchRockets()
    state.status = 'success'
  } catch (error) {
    state.status = 'error'
    state.errorMessage = error instanceof Error ? error.message : 'Unknown error'
  }
}

function addRocket(draft: RocketDraft) {
  const rocket: Rocket = {
    ...draft,
    id: `local-${crypto.randomUUID()}`,
    source: 'local',
  }

  state.customRockets = [rocket, ...state.customRockets]
  persistCustomRockets()

  return rocket
}

function getRocketById(id: string) {
  return [...state.customRockets, ...state.apiRockets].find((rocket) => rocket.id === id) ?? null
}

export function useRocketsStore() {
  const rockets = computed(() => [...state.customRockets, ...state.apiRockets])
  const hasLoaded = computed(() => state.status === 'success' || state.apiRockets.length > 0)

  return {
    state: readonly(state),
    rockets,
    hasLoaded,
    loadRockets,
    addRocket,
    getRocketById,
  }
}
