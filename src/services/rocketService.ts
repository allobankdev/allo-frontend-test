import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status}`)
  }

  const data: RocketListResponse = await response.json()

  return data.results
}

export async function getRocketById(id: number): Promise<Rocket> {
  const response = await fetch(
    `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket: ${response.status}`)
  }

  return response.json()
}
