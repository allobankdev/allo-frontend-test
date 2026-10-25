import axios from 'axios'

/** Normalized axios error — `status` lets callers distinguish 404 from other failures. */
export class HttpError extends Error {
  readonly status?: number

  constructor (message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/** Extracted as a pure function so the error-mapping rules can be unit tested without a real request. */
export function normalizeHttpError (error: unknown): unknown {
  if (!axios.isAxiosError(error)) return error

  if (error.response) {
    if (error.response.status === 429) {
      return new HttpError(
        'Terlalu banyak permintaan ke API (limit 15 request/jam untuk pengguna anonim). Coba lagi dalam beberapa menit.',
        429,
      )
    }
    return new HttpError(`Request gagal (${error.response.status})`, error.response.status)
  }

  if (error.code === 'ECONNABORTED') {
    return new HttpError('Request timeout, coba lagi')
  }

  return new HttpError('Tidak bisa terhubung ke server')
}

// README-mandated dev host — DON'T switch to the 2.3.0 endpoint or the ll.thespacedevs.com
// prod host (renames/moves several fields and throttles much harder for anonymous users).
export const DEFAULT_API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 10_000,
})

httpClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeHttpError(error)),
)
