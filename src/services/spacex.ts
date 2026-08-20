import type { Rocket } from '@/types/rocket'

/**
 * Thin wrapper around the public SpaceX v4 API.
 * https://github.com/r-spacex/SpaceX-API
 *
 * Kept free of any Vue/Pinia dependency so it can be unit-tested in isolation and
 * reused anywhere. Throws on non-OK responses so callers can drive their error state.
 */

const BASE_URL = 'https://api.spacexdata.com/v4'

async function request<T> (path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`SpaceX API request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getRockets (): Promise<Rocket[]> {
  return request<Rocket[]>('/rockets')
}

export function getRocketById (id: string): Promise<Rocket> {
  return request<Rocket>(`/rockets/${id}`)
}
