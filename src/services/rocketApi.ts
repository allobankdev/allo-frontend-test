/**
 * services/rocketApi.ts
 *
 * Axios-based client for the Launch Library 2 API. Keeps every API detail
 * (host, query params, response shape) out of the queries and components:
 * they only ever deal with `Rocket`.
 */

import axios, { AxiosError } from 'axios'
import type { LL2Launcher, LL2ListResponse, Rocket } from '@/types/rocket'

/**
 * The `lldev` host mirrors production data with a far more generous rate
 * limit (production allows only 15 requests/hour for anonymous users).
 */
const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const rocketHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

/** Error carrying a message that is safe to show in the UI. */
export class RocketApiError extends Error {
  constructor (message: string, readonly cause?: unknown) {
    super(message)
    this.name = 'RocketApiError'
  }
}

/** Turns any axios failure into a message worth showing a user. */
function toRocketApiError (error: unknown): RocketApiError {
  if (!axios.isAxiosError(error)) {
    return new RocketApiError('Something went wrong while loading rockets. Please try again.', error)
  }

  const { response, code } = error as AxiosError

  if (code === 'ECONNABORTED') {
    return new RocketApiError('The rocket service took too long to respond. Please try again.', error)
  }

  if (!response) {
    return new RocketApiError('Could not reach the rocket service. Check your connection and try again.', error)
  }

  if (response.status === 429) {
    return new RocketApiError('Too many requests to the rocket service. Please wait a moment and try again.', error)
  }

  if (response.status === 404) {
    return new RocketApiError('That rocket could not be found.', error)
  }

  return new RocketApiError(
    `The rocket service responded with an error (${response.status}). Please try again.`,
    error,
  )
}

// Normalises rejections once, so callers never handle raw axios errors.
// Cancellations pass through untouched for TanStack Query to recognise.
rocketHttp.interceptors.response.use(
  response => response,
  (error: unknown) => Promise.reject(
    axios.isCancel(error) ? error : toRocketApiError(error),
  ),
)

/** Maps an API launcher onto the app's own rocket shape. */
export function mapLauncherToRocket (launcher: LL2Launcher): Rocket {
  const cost = Number(launcher.launch_cost)

  return {
    id: String(launcher.id),
    // `full_name` is the requested label, but fall back so a rocket is never
    // rendered nameless.
    name: launcher.full_name || launcher.name || 'Unnamed rocket',
    description: launcher.description || null,
    imageUrl: launcher.image_url || null,
    // `launch_cost` arrives as a string, and is absent for most Starships.
    launchCost: launcher.launch_cost && Number.isFinite(cost) ? cost : null,
    country: launcher.manufacturer?.country_code || null,
    firstFlight: launcher.maiden_flight || null,
    isLocal: false,
  }
}

/** Fetches every SpaceX rocket. */
export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const { data } = await rocketHttp.get<LL2ListResponse<LL2Launcher>>('/config/launcher/', {
    // `mode=detailed` is required for `description` and the other detail
    // fields; `limit=20` fits all 13 SpaceX rockets into a single page.
    params: { manufacturer__name: 'SpaceX', mode: 'detailed', limit: 20 },
    signal,
  })

  return (data.results ?? []).map(mapLauncherToRocket)
}

/** Fetches a single rocket by its API id. */
export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const { data } = await rocketHttp.get<LL2Launcher>(`/config/launcher/${encodeURIComponent(id)}/`, {
    params: { mode: 'detailed' },
    signal,
  })

  return mapLauncherToRocket(data)
}
