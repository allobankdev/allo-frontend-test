import { apiClient } from './client'
import type { LauncherConfigApiResponse, PaginatedResponse } from '@/types/api'
import type { Rocket } from '@/types/rocket'

export function mapApiResponseToRocket(item: LauncherConfigApiResponse): Rocket {
  return {
    id: item.id,
    name: item.full_name || item.name || 'Unknown Rocket',
    description: item.description || 'No description available.',
    imageUrl: item.image_url || null,
    launchCost: item.launch_cost || null,
    country: item.manufacturer?.country_code || null,
    maidenFlight: item.maiden_flight || null,
    isCustom: false,
  }
}

export async function fetchLaunchers(): Promise<Rocket[]> {
  const response = await apiClient.get<PaginatedResponse<LauncherConfigApiResponse>>(
    '/config/launcher/',
    {
      params: {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: 20,
      },
    }
  )

  return (response.data.results || []).map(mapApiResponseToRocket)
}

export async function fetchLauncherById(id: string | number): Promise<Rocket> {
  const response = await apiClient.get<LauncherConfigApiResponse>(`/config/launcher/${id}/`)
  return mapApiResponseToRocket(response.data)
}
