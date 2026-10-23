import { reactive, toRef } from 'vue'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  maidenFlight: string | null
  isLocal?: boolean
}

export interface NewRocket {
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  maidenFlight: string | null
}

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface ApiRocket {
  id?: string | number
  full_name?: unknown
  description?: unknown
  image_url?: unknown
  launch_cost?: unknown
  maiden_flight?: unknown
  manufacturer?: { country_code?: unknown } | null
}

interface RocketState {
  rockets: Rocket[]
  status: LoadStatus
  errorMessage: string | null
}

const state = reactive<RocketState>({
  rockets: [],
  status: 'idle',
  errorMessage: null,
})

let localRocketSequence = 0

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asText (value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  return null
}

function mapRocket (value: unknown): Rocket {
  if (!isRecord(value)) {
    throw new Error('The rocket service returned an invalid rocket record.')
  }

  const apiRocket = value as ApiRocket
  const name = asText(apiRocket.full_name)
  const id = asText(apiRocket.id)

  if (!name || !id) {
    throw new Error('A rocket record is missing its name or ID.')
  }

  return {
    id,
    name,
    description: asText(apiRocket.description),
    imageUrl: asText(apiRocket.image_url),
    launchCost: asText(apiRocket.launch_cost),
    country: isRecord(apiRocket.manufacturer) ? asText(apiRocket.manufacturer.country_code) : null,
    maidenFlight: asText(apiRocket.maiden_flight),
  }
}

async function requestJson (url: string): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Network request failed.'
    throw new Error(`Could not reach the rocket service. ${detail}`)
  }

  if (!response.ok) {
    throw new Error(`The rocket service returned HTTP ${response.status}.`)
  }

  try {
    return await response.json() as unknown
  } catch {
    throw new Error('The rocket service returned an unreadable response.')
  }
}

export function useRocketsStore () {
  async function loadRockets (retry = false): Promise<void> {
    if (state.status === 'success' && !retry) return

    state.status = 'loading'
    state.errorMessage = null

    try {
      const result = await requestJson(`${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`)

      if (!isRecord(result) || !Array.isArray(result.results)) {
        throw new Error('The rocket service returned an unexpected list response.')
      }

      state.rockets = result.results.map(mapRocket)
      state.status = 'success'
    } catch (error) {
      state.status = 'error'
      state.errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
    }
  }

  async function fetchRocket (id: string): Promise<Rocket> {
    const cachedRocket = state.rockets.find(rocket => rocket.id === id)
    if (cachedRocket?.isLocal) return cachedRocket

    const result = await requestJson(`${API_BASE_URL}/${encodeURIComponent(id)}/`)
    const rocket = mapRocket(result)
    const existingIndex = state.rockets.findIndex(item => item.id === rocket.id)

    if (existingIndex === -1) {
      state.rockets.push(rocket)
    } else {
      state.rockets[existingIndex] = rocket
    }

    return rocket
  }

  function addRocket (input: NewRocket): void {
    localRocketSequence += 1
    state.rockets.unshift({
      ...input,
      id: `local-${Date.now()}-${localRocketSequence}`,
      isLocal: true,
    })
    state.status = 'success'
  }

  return {
    rockets: toRef(state, 'rockets'),
    status: toRef(state, 'status'),
    errorMessage: toRef(state, 'errorMessage'),
    loadRockets,
    fetchRocket,
    addRocket,
  }
}
