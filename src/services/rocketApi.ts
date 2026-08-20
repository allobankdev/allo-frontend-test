import type { Rocket, RocketId, RocketListResponse } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const ROCKET_LIST_URL = `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export class RocketApiError extends Error {
  constructor (
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'RocketApiError'
  }
}

async function request<T> (url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new RocketApiError(
      response.status === 404
        ? 'The requested rocket could not be found.'
        : 'The rocket service is temporarily unavailable.',
      response.status,
    )
  }

  return response.json() as Promise<T>
}

export async function getRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const response = await request<RocketListResponse>(ROCKET_LIST_URL, signal)

  if (!Array.isArray(response.results)) {
    throw new RocketApiError('The rocket service returned an unexpected response.')
  }

  return response.results
}

export async function getRocket (
  id: RocketId,
  signal?: AbortSignal,
): Promise<Rocket> {
  return request<Rocket>(
    `${API_BASE_URL}/config/launcher/${encodeURIComponent(String(id))}/`,
    signal,
  )
}
