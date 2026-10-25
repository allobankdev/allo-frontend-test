import type { RocketApiRecord, RocketListApiResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

const ROCKET_LIST_PATH = '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

export class RocketApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'RocketApiError'
    this.status = status
  }
}

async function request<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch {
    // fetch() only rejects on network-level failures (offline, CORS, DNS, ...)
    throw new RocketApiError('Could not reach the rocket API. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new RocketApiError(
      response.status === 404
        ? 'Rocket not found.'
        : `The rocket API responded with an error (status ${response.status}).`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}

/** Fetches all SpaceX rockets in a single request. */
export function fetchRockets (): Promise<RocketListApiResponse> {
  return request<RocketListApiResponse>(ROCKET_LIST_PATH)
}

export function fetchRocketById (id: number | string): Promise<RocketApiRecord> {
  return request<RocketApiRecord>(`/config/launcher/${id}/`)
}


