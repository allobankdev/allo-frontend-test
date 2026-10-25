import { reactive, readonly } from 'vue'
import { getRocket, getRockets } from '@/services/rocketApi'
import type { NewRocketInput, Rocket } from '@/types/rocket'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface RequestState {
  status: LoadStatus
  error: string | null
}

interface RocketState {
  rockets: Rocket[]
  listRequest: RequestState
  details: Record<string, Rocket | undefined>
  detailRequests: Record<string, RequestState | undefined>
}

const state = reactive<RocketState>({
  rockets: [],
  listRequest: { status: 'idle', error: null },
  details: {},
  detailRequests: {},
})

const idleRequest: Readonly<RequestState> = {
  status: 'idle',
  error: null,
}

let nextLocalId = -1

function errorMessage (error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Something went wrong while loading rocket data.'
}

function optionalValue (value: string): string | null {
  return value.trim() || null
}

function validateImageUrl (value: string): string | null {
  const normalizedValue = optionalValue(value)
  if (!normalizedValue) return null

  try {
    const url = new URL(normalizedValue)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error()
    return url.toString()
  } catch {
    throw new Error('Image URL must be a valid HTTP or HTTPS URL.')
  }
}

async function fetchRockets (force = false): Promise<void> {
  if (state.listRequest.status === 'loading') return
  if (!force && state.listRequest.status === 'success') return

  state.listRequest = { status: 'loading', error: null }

  try {
    const apiRockets = await getRockets()
    const localRockets = state.rockets.filter(rocket => rocket.source === 'local')
    state.rockets = [...localRockets, ...apiRockets]
    state.listRequest = { status: 'success', error: null }
  } catch (error) {
    state.listRequest = { status: 'error', error: errorMessage(error) }
  }
}

async function fetchRocket (routeId: string, force = false): Promise<void> {
  const id = Number(routeId)
  const requestKey = String(routeId)
  const localRocket = state.rockets.find(rocket => rocket.id === id && rocket.source === 'local')

  if (localRocket) {
    state.details[requestKey] = localRocket
    state.detailRequests[requestKey] = { status: 'success', error: null }
    return
  }

  if (!Number.isInteger(id) || id <= 0) {
    state.detailRequests[requestKey] = {
      status: 'error',
      error: 'This rocket does not exist or is no longer available.',
    }
    return
  }

  const request = state.detailRequests[requestKey]
  if (request?.status === 'loading') return
  if (!force && request?.status === 'success') return

  state.detailRequests[requestKey] = { status: 'loading', error: null }

  try {
    const rocket = await getRocket(id)
    state.details[requestKey] = rocket
    state.detailRequests[requestKey] = { status: 'success', error: null }

    const listIndex = state.rockets.findIndex(item => item.id === rocket.id)
    if (listIndex >= 0) state.rockets[listIndex] = rocket
  } catch (error) {
    state.detailRequests[requestKey] = {
      status: 'error',
      error: errorMessage(error),
    }
  }
}

function addRocket (input: NewRocketInput): Rocket {
  const fullName = input.fullName.trim()
  if (!fullName) throw new Error('Rocket name is required.')

  const launchCost = optionalValue(input.launchCost)
  if (launchCost && !/^\d+$/.test(launchCost)) {
    throw new Error('Launch cost must contain numbers only.')
  }

  const maidenFlight = optionalValue(input.maidenFlight)
  if (maidenFlight && !/^\d{4}-\d{2}-\d{2}$/.test(maidenFlight)) {
    throw new Error('First flight must be a valid date.')
  }

  const rocket: Rocket = {
    id: nextLocalId--,
    fullName,
    description: optionalValue(input.description),
    imageUrl: validateImageUrl(input.imageUrl),
    launchCost,
    country: optionalValue(input.country)?.toUpperCase() ?? null,
    maidenFlight,
    source: 'local',
  }

  state.rockets.unshift(rocket)
  state.details[String(rocket.id)] = rocket
  state.detailRequests[String(rocket.id)] = { status: 'success', error: null }

  return rocket
}

function getDetail (routeId: string): Rocket | undefined {
  return state.details[String(routeId)]
}

function getDetailRequest (routeId: string): Readonly<RequestState> {
  return state.detailRequests[String(routeId)] ?? idleRequest
}

export function useRocketStore () {
  return {
    state: readonly(state),
    fetchRockets,
    fetchRocket,
    addRocket,
    getDetail,
    getDetailRequest,
  }
}
