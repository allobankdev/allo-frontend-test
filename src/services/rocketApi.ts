import type { PaginatedResponse, Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

async function request<T> (url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Network error. Check your connection and try again.')
  }

  if (response.status === 404) throw new Error('Rocket not found.')
  if (response.status === 429) throw new Error('Too many requests. Please wait a moment and try again.')
  if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)

  return response.json() as Promise<T>
}

export async function fetchRockets (): Promise<Rocket[]> {
  const params = new URLSearchParams({ manufacturer__name: 'SpaceX', mode: 'detailed', limit: '20' })
  const data = await request<PaginatedResponse<Rocket>>(`${BASE_URL}/?${params}`)
  return data.results
}

export function fetchRocket (id: number): Promise<Rocket> {
  return request<Rocket>(`${BASE_URL}/${id}/?mode=detailed`)
}
