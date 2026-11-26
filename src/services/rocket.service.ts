import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'
const LIST_PARAMS = new URLSearchParams({ manufacturer__name: 'SpaceX', mode: 'detailed', limit: '20' })

export class HttpError extends Error {
  constructor (readonly status: number) {
    super(`Request failed with status ${status}.`)
  }
}

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) throw new HttpError(response.status)
  return response.json()
}

export const rocketService = {
  getAll: async (): Promise<Rocket[]> => {
    const data = await request<RocketListResponse>(`${API_URL}?${LIST_PARAMS}`)
    return data.results
  },
  getById: (id: string) =>
    request<Rocket>(`${API_URL}${encodeURIComponent(id)}/?mode=detailed`),
}
