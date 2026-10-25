import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(
    `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status}`)
  }

  const data: RocketListResponse = await response.json()

  return data.results
}

export async function getRocketById(id: string | number): Promise<Rocket> {
  const response = await fetch(
    `${BASE_URL}/config/launcher/${id}/?mode=detailed`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket: ${response.status}`)
  }

  return response.json() as Promise<Rocket>
}