import type { Rocket, RocketApiResponse } from '@/types/rocket'

const API_BASE_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

const ROCKET_LIST_URL =
  `${API_BASE_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`

export async function fetchRockets(): Promise<Rocket[]> {
  const response = await fetch(ROCKET_LIST_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rockets: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as RocketApiResponse

  return data.results
}

export async function fetchRocketById(
  id: string | number,
): Promise<Rocket> {
  const response = await fetch(`${API_BASE_URL}${id}/`)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rocket: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as Rocket
}