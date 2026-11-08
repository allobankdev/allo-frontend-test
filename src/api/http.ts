/**
 * Minimal `fetch` wrapper: base URL, query params, timeout, cancellation,
 * and a typed error so the UI can show a helpful message.
 */

import { API_BASE_URL, API_TIMEOUT_MS } from '@/config'

export type ApiErrorKind = 'network' | 'timeout' | 'not-found' | 'rate-limit' | 'server' | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null

  constructor (kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

export interface HttpGetOptions {
  params?: Record<string, string | number>
  /** Cancels the request, e.g. when the page unmounts. */
  signal?: AbortSignal
  timeoutMs?: number
}

export function isAbortError (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export async function httpGet<T> (path: string, options: HttpGetOptions = {}): Promise<T> {
  const { params, signal, timeoutMs = API_TIMEOUT_MS } = options

  const url = new URL(`${API_BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value))
  }

  // One controller combines the caller's signal with our timeout.
  const controller = new AbortController()
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    if (signal?.aborted) controller.abort()

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) throw errorFromStatus(response.status)

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (timedOut) throw new ApiError('timeout', 'The server took too long to respond.')
    if (isAbortError(error)) throw error
    throw new ApiError('network', 'Could not reach the server. Check your connection.')
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

function errorFromStatus (status: number): ApiError {
  if (status === 404) return new ApiError('not-found', 'The requested data was not found.', status)
  if (status === 429) {
    return new ApiError('rate-limit', 'Too many requests. Please wait a moment and try again.', status)
  }
  if (status >= 500) return new ApiError('server', 'The server is having problems. Please try again.', status)
  return new ApiError('unknown', `Request failed with status ${status}.`, status)
}

/** User-facing message for any thrown value. */
export function getErrorMessage (error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Something went wrong. Please try again.'
}
