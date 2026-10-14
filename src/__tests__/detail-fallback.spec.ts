import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fetchLauncherById } from '@/api/spacex.client'
import { ROCKET_PLACEHOLDER_IMAGE, resolveRocketImage } from '@/composables/useRocketImage'
import { useRocketsStore } from '@/stores/rockets'
import { MISSING_COST_LABEL, MISSING_DATE_LABEL, formatLaunchCost, formatMaidenFlight } from '@/utils/format'
import type { Launcher } from '@/types/rocket'

vi.mock('@/api/spacex.client', () => ({
  fetchLaunchers: vi.fn(),
  fetchLauncherById: vi.fn(),
}))

const mockedFetchById = vi.mocked(fetchLauncherById)

const cached: Launcher = {
  id: 528,
  full_name: 'Starship',
  description: 'Fully reusable transport system',
  family: 'Starship',
  active: true,
  image_url: 'https://example.com/starship.jpg',
  launch_cost: null,
  maiden_flight: null,
  manufacturer: { name: 'SpaceX', country_code: 'USA' },
}

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.clearAllMocks()
})

describe('detail fallback', () => {
  it('resolves local-* ids from the store without fetching', async () => {
    const store = useRocketsStore()
    const local = store.addLocal({ full_name: 'Local Rocket' })
    const rocket = await store.loadDetail(local.id)
    expect(rocket?.full_name).toBe('Local Rocket')
    expect(mockedFetchById).not.toHaveBeenCalled()
    expect(store.detailStatus).toBe('success')
  })

  it('errors for unknown local-* ids without fetching', async () => {
    const store = useRocketsStore()
    const rocket = await store.loadDetail('local-does-not-exist')
    expect(rocket).toBeUndefined()
    expect(mockedFetchById).not.toHaveBeenCalled()
    expect(store.detailStatus).toBe('error')
  })

  it('returns the cached rocket first for known ids', async () => {
    const store = useRocketsStore()
    store.items = [cached]
    store.detailCache = { '528': cached }
    mockedFetchById.mockResolvedValue({ ...cached, description: 'Refreshed' })
    const rocket = await store.loadDetail(528)
    expect(rocket?.full_name).toBe('Starship')
    expect(store.detailStatus).toBe('success')
  })

  it('fetches uncached numeric ids and surfaces errors with retry', async () => {
    const store = useRocketsStore()
    mockedFetchById.mockRejectedValueOnce(new Error('offline'))
    const missing = await store.loadDetail(164)
    expect(missing).toBeUndefined()
    expect(store.detailStatus).toBe('error')

    mockedFetchById.mockResolvedValueOnce(cached)
    const rocket = await store.retryDetail(164)
    expect(rocket?.full_name).toBe('Starship')
    expect(store.detailStatus).toBe('success')
  })

  it('formats the known null fields of id 528 with fallbacks', () => {
    expect(formatLaunchCost(cached.launch_cost)).toBe(MISSING_COST_LABEL)
    expect(formatMaidenFlight(cached.maiden_flight)).toBe(MISSING_DATE_LABEL)
  })

  it('resolves missing images to the placeholder', () => {
    expect(resolveRocketImage(null, 522)).toBe(ROCKET_PLACEHOLDER_IMAGE)
    expect(resolveRocketImage(undefined, 528)).toBe(ROCKET_PLACEHOLDER_IMAGE)
    expect(resolveRocketImage('https://example.com/x.jpg', 164)).toBe('https://example.com/x.jpg')
  })
})
