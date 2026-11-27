import type { Rocket, RocketApiResponse } from '@/types/rocket'

// Using lldev.thespacedevs.com host as instructed for higher rate limits during development
const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function getSpaceXRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (HTTP ${response.status}: ${response.statusText})`)
  }

  const data: RocketApiResponse = await response.json()
  return data.results || []
}

export async function getRocketById(id: string | number): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket #${id} (HTTP ${response.status}: ${response.statusText})`)
  }

  const data: Rocket = await response.json()
  return data
}
