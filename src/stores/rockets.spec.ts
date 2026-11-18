import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRocketStore } from '@/stores/rockets'

const listPayload = {
  count: 2,
  next: null,
  results: [
    {
      id: 1,
      full_name: 'Falcon 9',
      description: 'Two-stage rocket',
      image_url: 'https://example.com/f9.jpg',
      launch_cost: 50000000,
      maiden_flight: '2010-06-04',
      manufacturer: { country_code: 'USA' },
    },
    {
      id: 2,
      full_name: 'Starship',
      description: null,
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: { country_code: 'USA' },
    },
  ],
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('rockets store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads the list and moves to success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(listPayload)))
    const store = useRocketStore()

    await store.loadRockets()

    expect(store.listStatus).toBe('success')
    expect(store.filteredRockets.map((r) => r.name)).toEqual(['Falcon 9', 'Starship'])
  })

  it('does not refetch a list that already loaded', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(listPayload))
    vi.stubGlobal('fetch', fetchMock)
    const store = useRocketStore()

    await store.loadRockets()
    await store.loadRockets()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('moves to error and recovers on retry', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(jsonResponse(listPayload))
    vi.stubGlobal('fetch', fetchMock)
    const store = useRocketStore()

    await store.loadRockets()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBeTruthy()

    await store.loadRockets(true)
    expect(store.listStatus).toBe('success')
    expect(store.listError).toBeNull()
  })

  it('filters by name, description and country, case-insensitively', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(listPayload)))
    const store = useRocketStore()
    await store.loadRockets()

    store.searchQuery = 'FALCON'
    expect(store.filteredRockets.map((r) => r.name)).toEqual(['Falcon 9'])

    store.searchQuery = 'two-stage'
    expect(store.filteredRockets.map((r) => r.name)).toEqual(['Falcon 9'])

    store.searchQuery = '   '
    expect(store.filteredRockets).toHaveLength(2)
  })

  it('shows locally added rockets first and in the filter', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(listPayload)))
    const store = useRocketStore()
    await store.loadRockets()

    store.addLocalRocket({
      name: 'Rocket Saya',
      description: null,
      imageUrl: null,
      launchCost: null,
      country: null,
      firstFlight: null,
    })

    expect(store.filteredRockets[0].name).toBe('Rocket Saya')
    store.searchQuery = 'saya'
    expect(store.filteredRockets.map((r) => r.name)).toEqual(['Rocket Saya'])
  })

  it('reads a detail from the cached list without another request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(listPayload))
    vi.stubGlobal('fetch', fetchMock)
    const store = useRocketStore()
    await store.loadRockets()

    await store.loadRocketDetail('api-1')

    expect(store.detail.status).toBe('success')
    expect(store.detail.rocket?.name).toBe('Falcon 9')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fetches a single rocket when it is not cached', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(listPayload.results[0]))
    vi.stubGlobal('fetch', fetchMock)
    const store = useRocketStore()

    await store.loadRocketDetail('api-1')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/config/launcher/1/'),
      expect.anything(),
    )
    expect(store.detail.rocket?.id).toBe('api-1')
  })

  it('reports a 404 as not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 404)))
    const store = useRocketStore()

    await store.loadRocketDetail('api-999')

    expect(store.detail.status).toBe('error')
    expect(store.detail.error).toBe('Rocket not found.')
  })

  it('treats an unknown local id as not found without calling the API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const store = useRocketStore()

    await store.loadRocketDetail('local-123')

    expect(store.detail.status).toBe('error')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ignores a slow response for a rocket the user already left', async () => {
    let resolveSlow: (value: Response) => void = () => {}
    const slow = new Promise<Response>((resolve) => { resolveSlow = resolve })
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockReturnValueOnce(slow)
        .mockResolvedValueOnce(jsonResponse(listPayload.results[1])),
    )
    const store = useRocketStore()

    const first = store.loadRocketDetail('api-1')
    await store.loadRocketDetail('api-2')
    resolveSlow(jsonResponse(listPayload.results[0]))
    await first

    expect(store.detail.id).toBe('api-2')
    expect(store.detail.rocket?.name).toBe('Starship')
  })
})
