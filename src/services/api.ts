import type { Rocket, RocketApiResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function fetchRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status} ${response.statusText}`)
  }

  const data: RocketApiResponse = await response.json()
  return data.results || []
}

export async function fetchRocketById(id: number | string): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket detail: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
