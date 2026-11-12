import type { Rocket, RocketDto, RocketListDto } from '../types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'
const LIST_URL = `${BASE_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`

/** Map the raw API payload to the shape the UI uses. */
export function normalizeRocket(raw: RocketDto): Rocket {
  return {
    id: String(raw.id),
    name: raw.full_name || raw.name || 'Unnamed rocket',
    description: raw.description || '',
    imageUrl: raw.image_url || '',
    launchCost: raw.launch_cost ?? null,
    country: raw.manufacturer?.country_code || '',
    maidenFlight: raw.maiden_flight || '',
    isLocal: false,
  }
}

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return (await response.json()) as T
}

export async function fetchRockets(): Promise<Rocket[]> {
  const data = await request<RocketListDto>(LIST_URL)
  return data.results.map(normalizeRocket)
}

export async function fetchRocket(id: string): Promise<Rocket> {
  return normalizeRocket(await request<RocketDto>(`${BASE_URL}${encodeURIComponent(id)}/`))
}
