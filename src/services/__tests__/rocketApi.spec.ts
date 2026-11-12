import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchRocketById, fetchRockets } from '../rocketApi'
import type { LauncherConfigDto } from '@/types/launchLibrary'

const launcher: LauncherConfigDto = {
  id: 161,
  full_name: 'Falcon Heavy',
  description: 'Roket kelas berat.',
  image_url: null,
  launch_cost: '90000000',
  maiden_flight: '2018-02-06',
  manufacturer: { country_code: 'USA' },
}

function mockFetch (body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), { status }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchRockets', () => {
  it('memanggil endpoint list v2.2.0 dengan mode=detailed dan limit=20', async () => {
    const fetchMock = mockFetch({ count: 1, next: null, previous: null, results: [launcher] })

    await fetchRockets()

    const url = new URL(fetchMock.mock.calls[0][0])
    expect(url.origin + url.pathname).toBe(
      'https://lldev.thespacedevs.com/2.2.0/config/launcher/',
    )
    expect(url.searchParams.get('manufacturer__name')).toBe('SpaceX')
    expect(url.searchParams.get('mode')).toBe('detailed')
    expect(url.searchParams.get('limit')).toBe('20')
  })

  it('mengembalikan rocket yang sudah dipetakan', async () => {
    mockFetch({ count: 1, next: null, previous: null, results: [launcher] })

    const rockets = await fetchRockets()

    expect(rockets).toHaveLength(1)
    expect(rockets[0]).toMatchObject({ id: '161', name: 'Falcon Heavy', imageUrl: null })
  })

  it('melempar ApiError jika status bukan 2xx', async () => {
    mockFetch({ detail: 'Request was throttled.' }, 429)

    await expect(fetchRockets()).rejects.toMatchObject({ name: 'ApiError', status: 429 })
  })
})

describe('fetchRocketById', () => {
  it('memanggil endpoint detail dan memetakan hasilnya', async () => {
    const fetchMock = mockFetch(launcher)

    const rocket = await fetchRocketById('161')

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://lldev.thespacedevs.com/2.2.0/config/launcher/161/',
    )
    expect(rocket.launchCost).toBe(90000000)
  })

  it('melempar ApiError untuk rocket yang tidak ada', async () => {
    mockFetch({ detail: 'Not found.' }, 404)

    await expect(fetchRocketById('999999')).rejects.toBeInstanceOf(ApiError)
  })
})
