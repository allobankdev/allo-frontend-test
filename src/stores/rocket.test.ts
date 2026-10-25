import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRocketStore } from './rocket'
import type { Rocket } from '@/types/rocket'

vi.mock('@/services/rocketService', () => ({
  getRockets: vi.fn(),
}))

const makeRocket = (override: Partial<Rocket> = {}): Rocket => ({
  id: 1,
  full_name: 'Falcon 9',
  description: 'Reusable orbital rocket',
  image_url: null,
  launch_cost: 67000000,
  maiden_flight: '2010-06-04',
  manufacturer: {
    country_code: 'US',
  },
  ...override,
})

describe('useRocketStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('combines local rockets before API rockets', () => {
    const store = useRocketStore()

    store.rockets = [makeRocket({ id: 1, full_name: 'Falcon 9' })]
    store.localRockets = [makeRocket({ id: 'local-1', full_name: 'Custom Rocket' })]

    expect(store.allRockets.map((rocket) => rocket.full_name)).toEqual([
      'Custom Rocket',
      'Falcon 9',
    ])
  })

  it('filters rockets by name and description', () => {
    const store = useRocketStore()

    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 9', description: 'Reusable booster' }),
      makeRocket({ id: 2, full_name: 'Starship', description: 'Mars vehicle' }),
    ]

    store.searchQuery = 'mars'

    expect(store.filteredRockets).toHaveLength(1)
    expect(store.filteredRockets[0].full_name).toBe('Starship')
  })

  it('filters rockets by country', () => {
    const store = useRocketStore()

    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 9', manufacturer: { country_code: 'US' } }),
      makeRocket({ id: 2, full_name: 'Test Rocket', manufacturer: { country_code: 'ID' } }),
    ]

    store.countryFilter = 'ID'

    expect(store.filteredRockets).toHaveLength(1)
    expect(store.filteredRockets[0].full_name).toBe('Test Rocket')
  })

  it('sorts rockets by launch cost from high to low', () => {
    const store = useRocketStore()

    store.rockets = [
      makeRocket({ id: 1, full_name: 'Cheap Rocket', launch_cost: 100 }),
      makeRocket({ id: 2, full_name: 'Expensive Rocket', launch_cost: 999 }),
    ]

    store.sortBy = 'cost-high'

    expect(store.filteredRockets.map((rocket) => rocket.full_name)).toEqual([
      'Expensive Rocket',
      'Cheap Rocket',
    ])
  })

  it('resets filters to default values', () => {
    const store = useRocketStore()

    store.searchQuery = 'falcon'
    store.countryFilter = 'US'
    store.sortBy = 'cost-low'

    store.resetFilters()

    expect(store.searchQuery).toBe('')
    expect(store.countryFilter).toBe('all')
    expect(store.sortBy).toBe('name-asc')
  })
})