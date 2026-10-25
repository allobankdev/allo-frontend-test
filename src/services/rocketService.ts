import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getRockets(): Promise<Rocket[]> {
  return request<RocketListResponse>(
    `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  ).then((data) => data.results)
}

export function getRocketById(
  id: string | number,
): Promise<Rocket> {
  return request<Rocket>(
    `${BASE_URL}/config/launcher/${id}/?mode=detailed`,
  )
}