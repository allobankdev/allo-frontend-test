import type { Rocket } from '@/types'

const BASE_URL = 'https://api.spacexdata.com/v4'

// Fetch all rockets
export async function fetchRockets(): Promise<Rocket[]> {
  const response = await fetch(`${BASE_URL}/rockets`)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status}`)
  }

  return response.json()
}

// Fetch a single rocket by ID
export async function fetchRocketById(id: string): Promise<Rocket> {
  const response = await fetch(`${BASE_URL}/rockets/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket: ${response.status}`)
  }

  return response.json()
}
