import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export async function fetchRockets (): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed',
    limit: '20',
  })

  const response = await fetch(`${BASE_URL}/?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (${response.status})`)
  }

  const data: RocketListResponse = await response.json()
  return data.results
}

export async function fetchRocketById (id: number): Promise<Rocket> {
  const response = await fetch(`${BASE_URL}/${id}/`)

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket (${response.status})`)
  }

  return response.json()
}
