import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function fetchSpaceXRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (Status ${response.status}: ${response.statusText})`)
  }

  const data: RocketListResponse = await response.json()
  return data.results || []
}

export async function fetchRocketById(id: number | string): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket detail (Status ${response.status}: ${response.statusText})`)
  }

  const data: Rocket = await response.json()
  return data
}
