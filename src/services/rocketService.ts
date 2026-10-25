import { API_CONFIG } from '@/constants/api'
import type { ApiResponse, Rocket } from '@/types/rocket'

export class RocketApiError extends Error {
  statusCode?: number
  isRateLimited: boolean

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'RocketApiError'
    this.statusCode = statusCode
    this.isRateLimited = statusCode === 429
  }
}

function handleHttpError(response: Response): never {
  if (response.status === 429) {
    throw new RocketApiError(
      'API rate limit reached (15 requests/hour for anonymous users). Please wait a few moments before retrying.',
      429,
    )
  }

  if (response.status === 404) {
    throw new RocketApiError('Rocket specifications could not be found on the server.', 404)
  }

  if (response.status >= 500) {
    throw new RocketApiError(
      'Space Devs API server is temporarily unavailable. Please try again later.',
      response.status,
    )
  }

  throw new RocketApiError(
    `Failed to fetch data (${response.status}: ${response.statusText || 'Unknown error'})`,
    response.status,
  )
}

export async function fetchRocketsList(signal?: AbortSignal): Promise<Rocket[]> {
  const url = new URL(API_CONFIG.BASE_URL)
  url.searchParams.set('manufacturer__name', API_CONFIG.DEFAULT_MANUFACTURER)
  url.searchParams.set('mode', API_CONFIG.DEFAULT_MODE)
  url.searchParams.set('limit', String(API_CONFIG.DEFAULT_LIMIT))

  try {
    const response = await fetch(url.toString(), {
      signal,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      handleHttpError(response)
    }

    const data: ApiResponse = await response.json()
    return data.results || []
  } catch (err: unknown) {
    if (err instanceof RocketApiError) {
      throw err
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Network error occurred while fetching rockets.'
    throw new RocketApiError(message)
  }
}

export async function fetchRocketById(id: number, signal?: AbortSignal): Promise<Rocket> {
  const url = `${API_CONFIG.BASE_URL}/${id}/?mode=${API_CONFIG.DEFAULT_MODE}`

  try {
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      handleHttpError(response)
    }

    const data: Rocket = await response.json()
    return data
  } catch (err: unknown) {
    if (err instanceof RocketApiError) {
      throw err
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Network error occurred while fetching rocket details.'
    throw new RocketApiError(message)
  }
}
