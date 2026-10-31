import type { ApiLauncher, ApiListResponse, Rocket } from '@/types/rocket'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://lldev.thespacedevs.com/2.2.0'

function toNumberOrNull (value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export function toRocket (api: ApiLauncher): Rocket {
  return {
    id: String(api.id),
    name: api.full_name || api.name || 'Unnamed rocket',
    description: api.description || null,
    imageUrl: api.image_url || null,
    launchCost: toNumberOrNull(api.launch_cost),
    country: api.manufacturer?.country_code || null,
    firstFlight: api.maiden_flight || null,
    isLocal: false,
  }
}

async function request<T> (path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`)
  }
  return response.json() as Promise<T>
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const data = await request<ApiListResponse<ApiLauncher>>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20',
    signal,
  )
  return data.results.map(toRocket)
}

export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const data = await request<ApiLauncher>(`/config/launcher/${encodeURIComponent(id)}/`, signal)
  return toRocket(data)
}

