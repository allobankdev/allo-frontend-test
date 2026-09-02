import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

/** Fetches all SpaceX rockets in a single request (max 20). */
export async function fetchRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (HTTP ${response.status})`)
  }

  const data: RocketListResponse = await response.json()
  return data.results
}

/** Fetches a single rocket by its numeric ID. */
export async function fetchRocketById(id: number): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/?mode=detailed`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket ${id} (HTTP ${response.status})`)
  }

  return response.json() as Promise<Rocket>
}
