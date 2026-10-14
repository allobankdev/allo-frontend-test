import type { LauncherConfigDto, LauncherConfigListResponse, Rocket } from '@/types/rocket'

// Launch Library 2 by The Space Devs — https://thespacedevs.com/llapi
//
// Pinned to API version 2.2.0 and the lldev.thespacedevs.com host, per the
// assignment README: lldev is the development host with a far more generous
// rate limit than the production host (ll.thespacedevs.com), which throttles
// anonymous requests to 15/hour.
const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=No+Image'

function toRocket (dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: dto.full_name,
    description: dto.description || 'No description available.',
    image: dto.image_url ?? FALLBACK_IMAGE,
    costPerLaunch: dto.launch_cost,
    country: dto.manufacturer?.country_code ?? 'Unknown',
    firstFlight: dto.maiden_flight,
  }
}

async function request<T> (path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function fetchRockets (): Promise<Rocket[]> {
  // limit=20 is required: the default page size is 10, and there are 13
  // SpaceX rockets — without it we'd silently render an incomplete list.
  const data = await request<LauncherConfigListResponse>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'
  )
  return data.results.map(toRocket)
}

export async function fetchRocketById (id: string): Promise<Rocket> {
  const data = await request<LauncherConfigDto>(`/config/launcher/${id}/`)
  return toRocket(data)
}
