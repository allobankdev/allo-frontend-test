import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export const ROCKET_LIST_URL = `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export class RocketApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message)
    this.name = 'RocketApiError'
  }
}

async function request<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new RocketApiError('Unable to reach the rocket service. Check your connection and retry.')
  }

  if (!response.ok) {
    const message = response.status === 404
      ? 'The requested rocket could not be found.'
      : 'The rocket service is temporarily unavailable.'

    throw new RocketApiError(message, response.status)
  }

  try {
    return await response.json() as T
  } catch {
    throw new RocketApiError('The rocket service returned an unreadable response.')
  }
}

export async function getRockets(): Promise<Rocket[]> {
  const response = await request<RocketListResponse>(ROCKET_LIST_URL)

  if (!Array.isArray(response.results)) {
    throw new RocketApiError('The rocket service returned an unexpected response.')
  }

  return response.results
}

export function getRocket(id: string | number): Promise<Rocket> {
  return request<Rocket>(`${API_BASE_URL}/${encodeURIComponent(String(id))}/`)
}
