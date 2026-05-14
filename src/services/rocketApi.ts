import type { Rocket } from '@/types/rocket'

const BASE_URL =
  import.meta.env.VITE_SPACEX_API_URL ?? 'https://api.spacexdata.com/v4'

export class ApiError extends Error {
  constructor (
    message: string,
    public readonly status: number | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isNotFound () {
    return this.status === 404
  }
}

async function request<T> (path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal })
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    throw new ApiError('Network request failed', null)
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }
  return response.json() as Promise<T>
}

export function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  return request<Rocket[]>('/rockets', signal)
}

export function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  return request<Rocket>(`/rockets/${id}`, signal)
}
