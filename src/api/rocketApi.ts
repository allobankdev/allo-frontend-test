import type { Rocket, RocketApiDto, RocketListResponse } from '@/types/rocket'
import { mapRocketDto } from '@/utils/rocketMapper'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const INVALID_RESPONSE_MESSAGE = 'Received an invalid response from the server.'
export const ROCKET_NOT_FOUND_MESSAGE = 'Rocket not found.'

export class ApiError extends Error {
  readonly status: number

  constructor (message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildErrorMessage (status: number, isDetail = false): string {
  if (status === 429) {
    return 'Too many requests. Please try again later.'
  }
  if (isDetail && status === 404) {
    return ROCKET_NOT_FOUND_MESSAGE
  }
  return `Failed to load rockets (HTTP ${status}).`
}

async function getJson<T> (url: string, signal?: AbortSignal, isDetail = false): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('Network error. Please check your connection and try again.', 0)
  }

  if (!response.ok) {
    throw new ApiError(buildErrorMessage(response.status, isDetail), response.status)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, 502)
  }

  if (typeof data !== 'object' || data === null) {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, 502)
  }

  return data as T
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed',
    limit: '20',
  })

  const data = await getJson<RocketListResponse>(
    `${BASE_URL}/config/launcher/?${params.toString()}`,
    signal,
    false,
  )

  if (!Array.isArray(data.results)) {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, 502)
  }

  return data.results.map(mapRocketDto)
}

export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const params = new URLSearchParams({
    mode: 'detailed',
  })

  const encodedId = encodeURIComponent(id)
  const dto = await getJson<RocketApiDto>(
    `${BASE_URL}/config/launcher/${encodedId}/?${params.toString()}`,
    signal,
    true,
  )

  return mapRocketDto(dto)
}
