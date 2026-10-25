import type { Rocket, RocketListResponse } from '../types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export async function fetchRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (Status ${response.status})`)
  }
  const data: RocketListResponse = await response.json()
  return data.results || []
}

export async function fetchRocketById(id: string | number): Promise<Rocket> {
  const url = `${BASE_URL}/${id}/`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch rocket detail for ID ${id} (Status ${response.status})`)
  }
  const data: Rocket = await response.json()
  return data
}
