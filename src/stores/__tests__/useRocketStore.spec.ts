import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRocketStore } from '../useRocketStore'
import { rocketApi } from '@/api/rocketApi'
import type { Rocket } from '@/types/rocket'

const mockRockets: Rocket[] = [
  {
    id: 1,
    name: 'Falcon 9',
    fullName: 'Falcon 9 Block 5',
    description: 'First orbital class reusable rocket',
    launchCost: 67000000,
    countryCode: 'USA',
    maidenFlight: '2010-06-04',
    imageUrl: 'https://example.com/falcon9.jpg',
    family: 'Falcon',
    active: true,
    reusable: true,
    isCustom: false,
  },
  {
    id: 2,
    name: 'Falcon 1',
    fullName: 'Falcon 1',
    description: 'First privately developed liquid-fuel rocket to reach orbit',
    launchCost: 7000000,
    countryCode: 'USA',
    maidenFlight: '2006-03-24',
    imageUrl: null,
    family: 'Falcon',
    active: false,
    reusable: false,
    isCustom: false,
  },
  {
    id: 3,
    name: 'Starship',
    fullName: 'Starship V2',
    description: 'Fully reusable super heavy-lift launch vehicle',
    launchCost: null,
    countryCode: 'USA',
    maidenFlight: null,
    imageUrl: 'https://example.com/starship.jpg',
    family: 'Starship',
    active: true,
    reusable: true,
    isCustom: false,
  },
]

describe('useRocketStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('initializes with empty state and default filters', () => {
    const store = useRocketStore()
    expect(store.rockets).toEqual([])
    expect(store.customRockets).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.searchQuery).toBe('')
    expect(store.statusFilter).toBe('all')
    expect(store.totalCount).toBe(0)
  })

  it('fetches and stores rockets on fetchRockets()', async () => {
    vi.spyOn(rocketApi, 'fetchSpaceXRockets').mockResolvedValueOnce(mockRockets)
    const store = useRocketStore()

    await store.fetchRockets()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.rockets.length).toBe(3)
    expect(store.totalCount).toBe(3)
  })

  it('handles error when fetchSpaceXRockets fails', async () => {
    vi.spyOn(rocketApi, 'fetchSpaceXRockets').mockRejectedValueOnce(new Error('Network Error'))
    const store = useRocketStore()

    await store.fetchRockets()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network Error')
    expect(store.rockets).toEqual([])
  })

  it('filters rockets correctly by search query', async () => {
    vi.spyOn(rocketApi, 'fetchSpaceXRockets').mockResolvedValueOnce(mockRockets)
    const store = useRocketStore()
    await store.fetchRockets()

    store.setSearchQuery('starship')
    expect(store.filteredRockets.length).toBe(1)
    expect(store.filteredRockets[0].name).toBe('Starship')

    store.setSearchQuery('reusable')
    expect(store.filteredRockets.length).toBe(2)
  })

  it('filters rockets correctly by status (active vs retired)', async () => {
    vi.spyOn(rocketApi, 'fetchSpaceXRockets').mockResolvedValueOnce(mockRockets)
    const store = useRocketStore()
    await store.fetchRockets()

    store.setStatusFilter('active')
    expect(store.filteredRockets.every((r) => r.active)).toBe(true)
    expect(store.filteredRockets.length).toBe(2)

    store.setStatusFilter('retired')
    expect(store.filteredRockets.every((r) => !r.active)).toBe(true)
    expect(store.filteredRockets.length).toBe(1)
    expect(store.filteredRockets[0].name).toBe('Falcon 1')
  })

  it('adds a custom rocket and immediately includes it in state', () => {
    const store = useRocketStore()

    const created = store.addRocket({
      fullName: 'Falcon Heavy Super',
      description: 'Upgraded version of Falcon Heavy with extra booster power',
      launchCost: 120000000,
      countryCode: 'USA',
      maidenFlight: '2027-01-01',
      active: true,
      reusable: true,
    })

    expect(created.isCustom).toBe(true)
    expect(created.fullName).toBe('Falcon Heavy Super')
    expect(store.customRockets.length).toBe(1)
    expect(store.allRockets.length).toBe(1)
    expect(store.filteredRockets[0].fullName).toBe('Falcon Heavy Super')
  })

  it('fetches rocket detail from local cache first if present', async () => {
    vi.spyOn(rocketApi, 'fetchSpaceXRockets').mockResolvedValueOnce(mockRockets)
    const apiDetailSpy = vi.spyOn(rocketApi, 'fetchRocketById')

    const store = useRocketStore()
    await store.fetchRockets()

    const detail = await store.fetchRocketDetail(1)
    expect(detail?.fullName).toBe('Falcon 9 Block 5')
    expect(store.selectedRocket?.fullName).toBe('Falcon 9 Block 5')
    expect(apiDetailSpy).not.toHaveBeenCalled()
  })

  it('fetches rocket detail from API if not cached locally', async () => {
    const singleRocket: Rocket = {
      ...mockRockets[0],
      id: 999,
      fullName: 'Remote Fetched Rocket',
    }
    const apiDetailSpy = vi.spyOn(rocketApi, 'fetchRocketById').mockResolvedValueOnce(singleRocket)

    const store = useRocketStore()
    const detail = await store.fetchRocketDetail(999)

    expect(apiDetailSpy).toHaveBeenCalledWith(999)
    expect(detail?.fullName).toBe('Remote Fetched Rocket')
    expect(store.selectedRocket?.fullName).toBe('Remote Fetched Rocket')
  })
})
