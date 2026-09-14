import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchRockets, ROCKETS_URL } from './rockets'

describe('fetchRockets', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the pinned Launch Library 2 endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchRockets()

    expect(fetchMock).toHaveBeenCalledWith(ROCKETS_URL)
    expect(ROCKETS_URL).toContain('/2.2.0/config/launcher/')
    expect(ROCKETS_URL).toContain('manufacturer__name=SpaceX')
    expect(ROCKETS_URL).toContain('mode=detailed')
    expect(ROCKETS_URL).toContain('limit=20')
  })

  it('returns the results array from the response', async () => {
    const results = [{ id: 1, full_name: 'Falcon 1' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results }),
    }))

    await expect(fetchRockets()).resolves.toEqual(results)
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }))

    await expect(fetchRockets()).rejects.toThrow('500')
  })
})
