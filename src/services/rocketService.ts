import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const LAUNCHER_CONFIG_ENDPOINT = `${BASE_URL}/config/launcher/`

/**
 * Custom error class for Launch Library 2 API failures so store/UI layers
 * can inspect readable messages and optional HTTP status codes.
 */
export class RocketApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'RocketApiError'
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRocket(value: unknown): value is Rocket {
  return isRecord(value) && typeof value.id === 'number' && Number.isFinite(value.id)
}

function isRocketListResponse(value: unknown): value is RocketListResponse {
  return (
    isRecord(value)
    && Array.isArray(value.results)
    && value.results.every(isRocket)
  )
}

async function extractErrorDetail(response: Response): Promise<string | null> {
  try {
    const body: unknown = await response.json()
    if (isRecord(body) && typeof body.detail === 'string' && body.detail.trim().length > 0) {
      return body.detail.trim()
    }
  } catch {
    // Response body is not JSON or cannot be read; fall back to HTTP status message.
  }

  return null
}

function buildHttpErrorMessage(status: number, detail: string | null, context: string): string {
  if (status === 404) {
    return detail ? `Rocket data not found: ${detail}` : `Requested ${context} was not found (404).`
  }

  if (status === 429) {
    return 'API rate limit exceeded. Please wait a moment and try again.'
  }

  if (status >= 500) {
    return `Rocket service is currently unavailable (HTTP ${status}). Please try again later.`
  }

  return detail
    ? `Failed to fetch ${context} (HTTP ${status}): ${detail}`
    : `Failed to fetch ${context} (HTTP ${status}).`
}

async function fetchJson(url: string, context: string): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new RocketApiError(
      `Network error while fetching ${context}. Please check your internet connection and try again.`,
    )
  }

  if (!response.ok) {
    const detail = await extractErrorDetail(response)
    throw new RocketApiError(
      buildHttpErrorMessage(response.status, detail, context),
      response.status,
    )
  }

  try {
    return await response.json()
  } catch {
    throw new RocketApiError(
      `Invalid JSON response received while fetching ${context}.`,
      response.status,
    )
  }
}

/**
 * Fetches all 13 SpaceX rockets from Launch Library 2 API v2.2.0 in a single request.
 */
export async function fetchRockets(): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: 'SpaceX',
    mode: 'detailed',
    limit: '20',
  })

  const url = `${LAUNCHER_CONFIG_ENDPOINT}?${params.toString()}`
  const data = await fetchJson(url, 'rocket list')

  if (!isRocketListResponse(data)) {
    throw new RocketApiError('Unexpected rocket list format received from API.')
  }

  return data.results
}

/**
 * Fetches detailed information for a single rocket by its ID.
 */
export async function fetchRocketById(id: number | string): Promise<Rocket> {
  if (typeof id === 'number' && !Number.isFinite(id)) {
    throw new RocketApiError('Invalid rocket ID.')
  }

  const normalizedId = String(id).trim()
  if (normalizedId.length === 0) {
    throw new RocketApiError('Rocket ID is required.')
  }

  const url = `${LAUNCHER_CONFIG_ENDPOINT}${encodeURIComponent(normalizedId)}/`
  const data = await fetchJson(url, `rocket #${normalizedId}`)

  if (!isRocket(data)) {
    throw new RocketApiError('Unexpected rocket detail format received from API.')
  }

  return data
}
