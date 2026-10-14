/**
 * services/rocketService.ts
 *
 * Launch Library 2 (v2.2.0) API calls. Responses are validated and mapped
 * to the app's `Rocket` model; failures are thrown as `AppError`.
 */

import type { ApiLauncherConfig, ApiPaginatedResponse, Rocket } from '@/types/rocket'
import { AppError } from '@/utils/errors'
import { cleanText, parseCost } from '@/utils/parsers'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const REQUEST_TIMEOUT_MS = 15_000

// `mode=detailed` includes `description` and the other detail fields;
// `limit=20` returns all 13 SpaceX rockets in one page (the default page size is 10).
const SPACEX_ROCKETS_QUERY = new URLSearchParams({
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: '20',
})

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLauncherConfig (value: unknown): value is ApiLauncherConfig {
  return isRecord(value) && typeof value.id === 'number'
}

function isPaginatedResponse (value: unknown): value is ApiPaginatedResponse<unknown> {
  return isRecord(value) && Array.isArray(value.results)
}

function toRocket (launcher: ApiLauncherConfig): Rocket {
  return {
    id: String(launcher.id),
    source: 'api',
    name: cleanText(launcher.full_name) ?? cleanText(launcher.name) ?? 'Unnamed rocket',
    description: cleanText(launcher.description),
    imageUrl: cleanText(launcher.image_url),
    launchCost: parseCost(launcher.launch_cost),
    country: cleanText(launcher.manufacturer?.country_code),
    firstFlight: cleanText(launcher.maiden_flight),
  }
}

function httpErrorMessage (status: number): string {
  if (status === 404) return 'This rocket could not be found.'
  if (status === 429) return 'The Launch Library API rate limit was reached. Please wait a moment and try again.'
  if (status >= 500) return `The Launch Library API is currently unavailable (HTTP ${status}).`
  return `The request failed (HTTP ${status}).`
}

async function getJson (path: string): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError'
    throw new AppError(timedOut
      ? 'The Launch Library API took too long to respond.'
      : 'Unable to reach the Launch Library API. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new AppError(httpErrorMessage(response.status), { retryable: response.status !== 404 })
  }

  try {
    return await response.json()
  } catch {
    throw new AppError('The Launch Library API returned an unreadable response.')
  }
}

export async function fetchSpaceXRockets (): Promise<Rocket[]> {
  const data = await getJson(`/config/launcher/?${SPACEX_ROCKETS_QUERY}`)
  if (!isPaginatedResponse(data)) {
    throw new AppError('The Launch Library API returned an unexpected response.')
  }
  return data.results.filter(isLauncherConfig).map(toRocket)
}

export async function fetchRocketById (id: string): Promise<Rocket> {
  const data = await getJson(`/config/launcher/${encodeURIComponent(id)}/`)
  if (!isLauncherConfig(data)) {
    throw new AppError('The Launch Library API returned an unexpected response.')
  }
  return toRocket(data)
}
