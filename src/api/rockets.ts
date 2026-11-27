import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

async function handleResponse<T> (response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url, { signal })
  const data = await handleResponse<RocketListResponse>(response)
  return data.results
}

export async function fetchRocketById (id: number, signal?: AbortSignal): Promise<Rocket> {
  const url = `${BASE_URL}/${id}/`
  const response = await fetch(url, { signal })
  return handleResponse<Rocket>(response)
}