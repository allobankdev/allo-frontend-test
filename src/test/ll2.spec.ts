import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLaunchers, fetchLauncherById } from '@/api/ll2'

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ll2 api client', () => {
  it('requests the pinned v2.2.0 endpoint with mode=detailed and limit=20', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ results: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchLaunchers('SpaceX')

    const [url] = fetchMock.mock.calls[0] ?? []
    expect(String(url)).toContain('https://lldev.thespacedevs.com/2.2.0/config/launcher')
    expect(String(url)).toContain('manufacturer__name=SpaceX')
    expect(String(url)).toContain('mode=detailed')
    expect(String(url)).toContain('limit=20')
  })

  it('unwraps the results array from the page envelope', async () => {
    const payload = { results: [{ id: 1, full_name: 'Falcon 9' }] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(payload)))

    const launchers = await fetchLaunchers('SpaceX')

    expect(launchers).toEqual(payload.results)
  })

  it('reports the Retry-After window for a 429 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
      status: 429,
      headers: { 'Retry-After': '45' },
    })))

    await expect(fetchLaunchers('SpaceX')).rejects.toThrow(
      'Rate limited by Launch Library 2 (HTTP 429). Wait 45 seconds, then retry.',
    )
  })

  it('falls back to a generic wait hint when Retry-After is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 429 })))

    await expect(fetchLaunchers('SpaceX')).rejects.toThrow('Wait about a minute')
  })

  it('includes the failing status in errors for other HTTP failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })))

    await expect(fetchLauncherById(7)).rejects.toThrow('HTTP 500')
  })
})
