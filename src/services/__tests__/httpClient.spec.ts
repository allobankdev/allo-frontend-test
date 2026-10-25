import { AxiosError } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_API_BASE_URL, HttpError, httpClient, normalizeHttpError } from '../httpClient'

function makeResponseError (status: number): AxiosError {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data: {},
    headers: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: {} as any,
  })
}

describe('normalizeHttpError', () => {
  it('gives a specific rate-limit message for 429, distinct from the generic error', () => {
    const result = normalizeHttpError(makeResponseError(429))

    expect(result).toBeInstanceOf(HttpError)
    expect((result as HttpError).status).toBe(429)
    expect((result as HttpError).message).not.toBe('Request gagal (429)')
    expect((result as HttpError).message).toContain('Terlalu banyak permintaan')
  })

  it('falls back to a generic message with the status for other HTTP error codes', () => {
    const result = normalizeHttpError(makeResponseError(404))

    expect(result).toBeInstanceOf(HttpError)
    expect((result as HttpError).status).toBe(404)
    expect((result as HttpError).message).toBe('Request gagal (404)')
  })

  it('reports a timeout distinctly from a generic connection failure', () => {
    const timeoutError = new AxiosError('timeout of 10000ms exceeded', 'ECONNABORTED')
    const result = normalizeHttpError(timeoutError)

    expect(result).toBeInstanceOf(HttpError)
    expect((result as HttpError).message).toBe('Request timeout, coba lagi')
    expect((result as HttpError).status).toBeUndefined()
  })

  it('reports a generic connection failure when there is no response and no timeout code', () => {
    const networkError = new AxiosError('Network Error')
    const result = normalizeHttpError(networkError)

    expect(result).toBeInstanceOf(HttpError)
    expect((result as HttpError).message).toBe('Tidak bisa terhubung ke server')
  })

  it('passes non-axios errors through unchanged', () => {
    const original = new Error('something else entirely')
    expect(normalizeHttpError(original)).toBe(original)
  })
})

describe('baseURL', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults to the README-mandated dev host when VITE_API_BASE_URL is unset', () => {
    expect(httpClient.defaults.baseURL).toBe(DEFAULT_API_BASE_URL)
  })

  it('uses VITE_API_BASE_URL when it is set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://example.test/override')
    vi.resetModules()

    const { httpClient: reloaded } = await import('../httpClient')
    expect(reloaded.defaults.baseURL).toBe('https://example.test/override')
  })
})
