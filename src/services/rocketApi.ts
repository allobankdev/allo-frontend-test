import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(
    `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch rockets')
  }

  const data = await response.json()

  return data.results
}

export async function getRocketById(id: number): Promise<Rocket> {
  const response = await fetch(`${API_BASE_URL}/config/launcher/${id}/`)

  if (!response.ok) {
    throw new Error('Failed to fetch rocket')
  }

  return response.json()
}