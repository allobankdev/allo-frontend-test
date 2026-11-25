
import type { Rocket, RocketApiResponse } from '@/types/rocket'

const API_BASE_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher'

const ROCKET_LIST_URL =
  `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(ROCKET_LIST_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rockets: ${response.status} ${response.statusText}`,
    )
  }

  const data: RocketApiResponse = await response.json()

  return data.results
}

export async function getRocketById(id: string): Promise<Rocket> {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}/`)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rocket: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}
