/**
 * services/rockets.ts
 *
 * Rocket endpoints from Launch Library 2 (API v2.2.0).
 */

// Utilities
import http from './http'

// Types
import type { Rocket, RocketListResponse } from '@/types/rocket'

/**
 * `mode=detailed` is required to receive `description` and the other detail
 * fields, and `limit=20` returns all 13 SpaceX rockets in a single page.
 */
const ROCKET_LIST_PARAMS = {
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: 20,
} as const

export async function getRockets (): Promise<Rocket[]> {
  const { data } = await http.get<RocketListResponse>('/config/launcher/', {
    params: ROCKET_LIST_PARAMS,
  })

  return data.results
}

export async function getRocketById (id: number): Promise<Rocket> {
  const { data } = await http.get<Rocket>(`/config/launcher/${id}/`, {
    params: { mode: 'detailed' },
  })

  return data
}
