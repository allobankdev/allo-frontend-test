import { getJson } from './httpClient'
import type { LauncherConfigDto, PaginatedResponse } from '@/types/launchLibrary'
import type { Rocket } from '@/types/rocket'

const API_BASE_URL = import.meta.env.VITE_LL2_API_BASE_URL ?? 'https://lldev.thespacedevs.com/2.2.0'

/** Default page size is 10; 20 fetches every SpaceX rocket (13) in one request. */
const ROCKET_PAGE_SIZE = 20

function blankToNull (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function parseCost (value: string | null): number | null {
  const text = blankToNull(value)
  if (text == null) return null
  const cost = Number(text)
  return Number.isFinite(cost) ? cost : null
}

export function mapLauncherToRocket (dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: blankToNull(dto.full_name) ?? dto.name,
    description: blankToNull(dto.description),
    imageUrl: blankToNull(dto.image_url),
    costPerLaunch: parseCost(dto.launch_cost),
    country: blankToNull(dto.manufacturer?.country_code),
    firstFlight: blankToNull(dto.maiden_flight),
    isLocal: false,
  }
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    // Without `detailed` the response omits the description and cost fields.
    mode: 'detailed',
    limit: String(ROCKET_PAGE_SIZE),
  })
  const data = await getJson<PaginatedResponse<LauncherConfigDto>>(
    `${API_BASE_URL}/config/launcher/?${params}`,
    signal,
  )
  return data.results.map(mapLauncherToRocket)
}

export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const dto = await getJson<LauncherConfigDto>(
    `${API_BASE_URL}/config/launcher/${encodeURIComponent(id)}/`,
    signal,
  )
  return mapLauncherToRocket(dto)
}
