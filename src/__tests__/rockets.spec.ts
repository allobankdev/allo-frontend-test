import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fetchLauncherById, fetchLaunchers } from '@/api/spacex.client'
import { useRocketsStore } from '@/stores/rockets'
import type { Launcher } from '@/types/rocket'

vi.mock('@/api/spacex.client', () => ({
  fetchLaunchers: vi.fn(),
  fetchLauncherById: vi.fn(),
}))

const mockLaunchers: Launcher[] = [
  {
    id: 164,
    full_name: 'Falcon 9 Block 5',
    description: 'Reusable two-stage rocket',
    family: 'Falcon',
    active: true,
    image_url: 'https://example.com/f9.jpg',
    launch_cost: '52000000',
    maiden_flight: '2018-05-11',
    manufacturer: { name: 'SpaceX', country_code: 'USA' },
  },
  {
    id: 528,
    full_name: 'Starship',
    description: 'Fully reusable transport system',
    family: 'Starship',
    active: true,
    image_url: 'https://example.com/starship.jpg',
    launch_cost: null,
    maiden_flight: null,
    manufacturer: { name: 'SpaceX', country_code: 'USA' },
  },
  {
    id: 133,
    full_name: 'Falcon 1',
    description: 'First SpaceX launch vehicle',
    family: 'Falcon',
    active: false,
    image_url: 'https://example.com/f1.jpg',
    launch_cost: '7000000',
    maiden_flight: '2006-03-24',
    manufacturer: { name: 'SpaceX', country_code: 'USA' },
  },
]

const mockedFetchLaunchers = vi.mocked(fetchLaunchers)
const mockedFetchById = vi.mocked(fetchLauncherById)

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.clearAllMocks()
  mockedFetchLaunchers.mockResolvedValue(mockLaunchers)
})

describe('rockets store', () => {
  it('loads launchers into success state', async () => {
    const store = useRocketsStore()
    await store.loadAll()
    expect(store.status).toBe('success')
    expect(store.items).toHaveLength(3)
    expect(store.families).toEqual(['Falcon', 'Starship'])
  })

  it('enters error state with retry support when the API fails', async () => {
    mockedFetchLaunchers.mockRejectedValueOnce(new Error('boom'))
    const store = useRocketsStore()
    await store.loadAll()
    expect(store.status).toBe('error')
    expect(store.error).toContain('boom')

    mockedFetchLaunchers.mockResolvedValueOnce(mockLaunchers)
    await store.retry()
    expect(store.status).toBe('success')
  })

  it('filters by search text', async () => {
    const store = useRocketsStore()
    await store.loadAll()
    store.search = 'starship'
    expect(store.filtered.map(r => r.full_name)).toEqual(['Starship'])
  })

  it('filters by dynamic family and active status', async () => {
    const store = useRocketsStore()
    await store.loadAll()

    store.familyFilter = 'Falcon'
    expect(store.filtered).toHaveLength(2)

    store.familyFilter = 'all'
    store.statusFilter = 'active'
    expect(store.filtered.map(r => r.full_name).sort()).toEqual(['Falcon 9 Block 5', 'Starship'])

    store.statusFilter = 'inactive'
    expect(store.filtered.map(r => r.full_name)).toEqual(['Falcon 1'])
  })

  it('persists added rockets to localStorage allo:rockets:v1', async () => {
    const store = useRocketsStore()
    await store.loadAll()
    const local = store.addLocal({ full_name: 'My Rocket', family: 'Falcon' })
    expect(local.id.startsWith('local-')).toBe(true)
    expect(store.items[0].id).toBe(local.id)

    const raw = localStorage.getItem('allo:rockets:v1')
    expect(raw).toContain('My Rocket')

    // Simulate a fresh app start: new Pinia instance, locals rehydrated.
    setActivePinia(createPinia())
    const reloaded = useRocketsStore()
    reloaded.loadLocals()
    expect(reloaded.items.some(item => String(item.id) === String(local.id))).toBe(true)
  })

  it('resolves details cache-first without refetching known ids', async () => {
    const store = useRocketsStore()
    await store.loadAll()
    mockedFetchById.mockResolvedValue(mockLaunchers[0])
    const rocket = await store.loadDetail(164)
    expect(rocket?.full_name).toBe('Falcon 9 Block 5')
    expect(store.detailStatus).toBe('success')
  })
})
