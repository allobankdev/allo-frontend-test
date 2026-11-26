/**
 * services/http.ts
 *
 * Minimal JSON fetch wrapper. Every failure becomes an `ApiError`,
 * so callers only need to handle one error type.
 */

export class ApiError extends Error {
  /** HTTP status, or `null` when no response was received (offline, CORS). */
  readonly status: number | null

  constructor (message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  get isNotFound (): boolean {
    return this.status === 404
  }
}

/** True when a request was cancelled with an AbortController. */
export function isAbortError (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export async function getJson<T> (url: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    // Cancellation is not a failure — let the caller ignore it.
    if (isAbortError(error)) throw error
    throw new ApiError('Unable to reach the server. Please check your connection.')
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status), response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('Received an invalid response from the server.', response.status)
  }
}

function messageForStatus (status: number): string {
  if (status === 404) return 'The requested data could not be found.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'The server is having trouble right now. Please try again later.'
  return `Request failed with status ${status}.`
}