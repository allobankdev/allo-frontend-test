import type { Rocket, RocketApiDto, RocketListResponse } from '@/types/rocket'
import { mapRocketDto } from '@/utils/rocketMapper'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

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
    return 'Rocket not found.'
  }
  return `Failed to load rockets (HTTP ${status}).`
}

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed',
    limit: '20',
  })

  const response = await fetch(`${BASE_URL}/config/launcher/?${params.toString()}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError(buildErrorMessage(response.status, false), response.status)
  }

  const data = (await response.json()) as RocketListResponse
  const results = Array.isArray(data.results) ? data.results : []
  return results.map(mapRocketDto)
}

export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const params = new URLSearchParams({
    mode: 'detailed',
  })

  const encodedId = encodeURIComponent(id)
  const response = await fetch(`${BASE_URL}/config/launcher/${encodedId}/?${params.toString()}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError(buildErrorMessage(response.status, true), response.status)
  }

  const dto = (await response.json()) as RocketApiDto
  return mapRocketDto(dto)
}
