import { httpClient } from './httpClient'
import type { LauncherDto, Rocket } from '@/types/rocket'

interface LauncherListResponse {
  results: LauncherDto[]
}

export async function getRocketList (): Promise<LauncherDto[]> {
  const { data } = await httpClient.get<LauncherListResponse>('/config/launcher/', {
    params: {
      manufacturer__name: 'SpaceX',
      mode: 'detailed',
      limit: 20,
    },
  })
  return data.results
}

/** `id` is a string, not a number, so callers can pass `route.params.id` or `Rocket.id` directly. Callers must still filter out local-only ids (`local-...`) before calling this — those never exist on the server. */
export async function getRocketById (id: string): Promise<LauncherDto> {
  const { data } = await httpClient.get<LauncherDto>(`/config/launcher/${id}/`)
  return data
}

export function toRocket (dto: LauncherDto): Rocket {
  return {
    id: String(dto.id),
    name: dto.full_name,
    description: dto.description,
    imageUrl: dto.image_url,
    costPerLaunch: dto.launch_cost === null ? null : Number(dto.launch_cost),
    country: dto.manufacturer?.country_code ?? null,
    firstFlight: dto.maiden_flight,
  }
}
