import apiClient from './api'
import type { Rocket, RocketListResponse } from '@/types/rocket'

/**
 * Fetch all SpaceX rockets with mode=detailed and limit=20 as required
 */
export async function getSpaceXRockets(): Promise<Rocket[]> {
  const response = await apiClient.get<RocketListResponse>(
    '/config/launcher/',
    {
      params: {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: 20,
      },
    }
  )
  return response.data.results
}

/**
 * Fetch a single rocket by its ID
 */
export async function getRocketById(id: number | string): Promise<Rocket> {
  const response = await apiClient.get<Rocket>(`/config/launcher/${id}/`)
  return response.data
}
