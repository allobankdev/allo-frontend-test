import { afterEach, describe, expect, it, vi } from 'vitest'
import { getRocketById, getRockets } from './spacex'

const sampleRocket = {
  id: 'falcon1',
  name: 'Falcon 1',
  description: 'An expendable launch system.',
  flickr_images: ['https://example.com/a.jpg'],
  cost_per_launch: 6700000,
  country: 'Republic of the Marshall Islands',
  first_flight: '2006-03-24',
  active: false,
}

function mockFetch (response: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => response,
  } as Response)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getRockets', () => {
  it('returns the parsed list on success', async () => {
    vi.stubGlobal('fetch', mockFetch([sampleRocket]))
    const rockets = await getRockets()
    expect(rockets).toHaveLength(1)
    expect(rockets[0].name).toBe('Falcon 1')
  })

  it('calls the v4 rockets endpoint', async () => {
    const fetchMock = mockFetch([sampleRocket])
    vi.stubGlobal('fetch', fetchMock)
    await getRockets()
    expect(fetchMock).toHaveBeenCalledWith('https://api.spacexdata.com/v4/rockets')
  })

  it('throws on a non-OK response', async () => {
    vi.stubGlobal('fetch', mockFetch('nope', false, 500))
    await expect(getRockets()).rejects.toThrow()
  })
})

describe('getRocketById', () => {
  it('returns a single rocket on success', async () => {
    vi.stubGlobal('fetch', mockFetch(sampleRocket))
    const rocket = await getRocketById('falcon1')
    expect(rocket.id).toBe('falcon1')
  })

  it('requests the correct id path', async () => {
    const fetchMock = mockFetch(sampleRocket)
    vi.stubGlobal('fetch', fetchMock)
    await getRocketById('falcon1')
    expect(fetchMock).toHaveBeenCalledWith('https://api.spacexdata.com/v4/rockets/falcon1')
  })

  it('throws on a non-OK response', async () => {
    vi.stubGlobal('fetch', mockFetch('nope', false, 404))
    await expect(getRocketById('missing')).rejects.toThrow()
  })
})
