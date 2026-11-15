/**
 * services/apiClient.ts
 *
 * Minimal JSON client on top of the native Fetch API.
 */

import { isAbortError } from '@/utils/error'

const DEFAULT_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number | null

  constructor (message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** GETs `path` (relative to `API_BASE_URL`) and parses the JSON body as `T`. */
export async function fetchJson<T> (path: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Network error. Please check your connection.')
  }

  if (!response.ok) {
    throw new ApiError(getStatusMessage(response.status), response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Received an invalid response from the server.', response.status)
  }
}

function getStatusMessage (status: number): string {
  if (status === 404) return 'The requested rocket was not found.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'The server is currently unavailable. Please try again later.'
  return `Request failed with status ${status}.`
}
