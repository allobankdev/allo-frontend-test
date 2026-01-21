import type { Rocket } from '@/types/rocket'

const BASE_URL = 'https://api.spacexdata.com/v4'

export async function fetchRockets(): Promise<Rocket[]> {
  const res = await fetch(`${BASE_URL}/rockets`)
  if (!res.ok) throw new Error('Failed to fetch rockets')
  return res.json()
}

export async function fetchRocketById(id: string): Promise<Rocket> {
  const res = await fetch(`${BASE_URL}/rockets/${id}`)
  if (!res.ok) throw new Error('Failed to fetch rocket')
  return res.json()
}
