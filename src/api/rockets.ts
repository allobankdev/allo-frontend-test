import type { Ll2Rocket, Ll2RocketList, Rocket } from '@/types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const LIST_URL = `${API_BASE}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

function optionalString (value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value !== 'string') return null
  return value.trim() || null
}

export function normalizeRocket (rocket: Ll2Rocket): Rocket {
  return {
    id: String(rocket.id),
    name: optionalString(rocket.full_name) ?? 'Unnamed rocket',
    description: optionalString(rocket.description),
    imageUrl: optionalString(rocket.image_url),
    launchCost: optionalString(rocket.launch_cost),
    countryCode: optionalString(rocket.manufacturer?.country_code),
    maidenFlight: optionalString(rocket.maiden_flight),
    isLocal: false,
  }
}

async function getJson<T> (url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new Error('Unable to reach rocket service. Check your connection and try again.')
  }

  if (!response.ok) throw new Error(`Rocket service returned HTTP ${response.status}. Please try again.`)
  return response.json() as Promise<T>
}

export async function fetchRocketList (signal?: AbortSignal): Promise<Rocket[]> {
  const data = await getJson<Ll2RocketList>(LIST_URL, signal)
  if (!Array.isArray(data.results)) throw new Error('Rocket service returned an unexpected response.')
  return data.results.map(normalizeRocket)
}

export async function fetchRocketDetail (id: string, signal?: AbortSignal): Promise<Rocket> {
  return normalizeRocket(await getJson<Ll2Rocket>(`${API_BASE}/${encodeURIComponent(id)}/`, signal))
}
