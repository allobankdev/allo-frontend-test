/**
 * SpaceX API client (v4)
 * @see https://github.com/r-spacex/SpaceX-API
 */
import type { Rocket } from '@/types/rocket'

const BASE_URL = 'https://api.spacexdata.com/v4'

export async function fetchRockets(): Promise<Rocket[]> {
  const res = await fetch(`${BASE_URL}/rockets`)
  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchRocketById(id: string): Promise<Rocket | null> {
  const res = await fetch(`${BASE_URL}/rockets/${id}`)
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`SpaceX API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}
