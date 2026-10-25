import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '@/services/spacex'
import { useRocketsStore } from './rockets'
import type { Rocket } from '@/types/rocket'

const apiRocket: Rocket = {
  id: 'falcon1',
  name: 'Falcon 1',
  description: 'An expendable launch system.',
  flickr_images: ['https://example.com/a.jpg'],
  cost_per_launch: 6700000,
  country: 'Republic of the Marshall Islands',
  first_flight: '2006-03-24',
  active: false,
}

const heavyRocket: Rocket = {
  ...apiRocket,
  id: 'falconheavy',
  name: 'Falcon Heavy',
  description: 'The most powerful operational rocket.',
  active: true,
}

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchRockets', () => {
  it('moves status loading -> success and fills rockets', async () => {
    vi.spyOn(api, 'getRockets').mockResolvedValue([apiRocket, heavyRocket])
    const store = useRocketsStore()
    expect(store.status).toBe('idle')
    await store.fetchRockets()
    expect(store.status).toBe('success')
    expect(store.rockets).toHaveLength(2)
  })

  it('sets status error when the request throws', async () => {
    vi.spyOn(api, 'getRockets').mockRejectedValue(new Error('boom'))
    const store = useRocketsStore()
    await store.fetchRockets()
    expect(store.status).toBe('error')
    expect(store.rockets).toHaveLength(0)
  })
})

describe('addRocket', () => {
  it('prepends a custom rocket and persists it to localStorage', () => {
    const store = useRocketsStore()
    store.addRocket({
      name: 'My Rocket',
      description: 'Home built.',
      imageUrl: 'https://example.com/my.jpg',
      cost_per_launch: 100,
      country: 'Indonesia',
      first_flight: '2026-01-01',
    })
    expect(store.customRockets).toHaveLength(1)
    expect(store.customRockets[0].name).toBe('My Rocket')
    expect(store.customRockets[0].flickr_images).toEqual(['https://example.com/my.jpg'])

    const persisted = JSON.parse(localStorage.getItem('custom-rockets') ?? '[]')
    expect(persisted).toHaveLength(1)
    expect(persisted[0].name).toBe('My Rocket')
  })
})

describe('allRockets and filteredRockets', () => {
  it('lists custom rockets ahead of API rockets', async () => {
    vi.spyOn(api, 'getRockets').mockResolvedValue([apiRocket])
    const store = useRocketsStore()
    await store.fetchRockets()
    store.addRocket({
      name: 'Custom One',
      description: 'x',
      imageUrl: '',
      cost_per_launch: 1,
      country: 'Indonesia',
      first_flight: '2026-01-01',
    })
    expect(store.allRockets[0].name).toBe('Custom One')
    expect(store.allRockets).toHaveLength(2)
  })

  it('filters by name case-insensitively', async () => {
    vi.spyOn(api, 'getRockets').mockResolvedValue([apiRocket, heavyRocket])
    const store = useRocketsStore()
    await store.fetchRockets()
    store.searchQuery = 'heavy'
    expect(store.filteredRockets).toHaveLength(1)
    expect(store.filteredRockets[0].name).toBe('Falcon Heavy')
  })

  it('matches the description too', async () => {
    vi.spyOn(api, 'getRockets').mockResolvedValue([apiRocket, heavyRocket])
    const store = useRocketsStore()
    await store.fetchRockets()
    store.searchQuery = 'powerful'
    expect(store.filteredRockets).toHaveLength(1)
    expect(store.filteredRockets[0].name).toBe('Falcon Heavy')
  })
})

describe('getRocketById', () => {
  it('returns an in-memory rocket without calling the API', async () => {
    const spy = vi.spyOn(api, 'getRocketById')
    vi.spyOn(api, 'getRockets').mockResolvedValue([apiRocket])
    const store = useRocketsStore()
    await store.fetchRockets()
    const rocket = await store.getRocketById('falcon1')
    expect(rocket?.name).toBe('Falcon 1')
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a custom rocket from the store', async () => {
    const spy = vi.spyOn(api, 'getRocketById')
    const store = useRocketsStore()
    const created = store.addRocket({
      name: 'Custom One',
      description: 'x',
      imageUrl: '',
      cost_per_launch: 1,
      country: 'Indonesia',
      first_flight: '2026-01-01',
    })
    const rocket = await store.getRocketById(created.id)
    expect(rocket?.name).toBe('Custom One')
    expect(spy).not.toHaveBeenCalled()
  })

  it('falls back to the API when not in memory', async () => {
    vi.spyOn(api, 'getRocketById').mockResolvedValue(heavyRocket)
    const store = useRocketsStore()
    const rocket = await store.getRocketById('falconheavy')
    expect(rocket?.name).toBe('Falcon Heavy')
  })
})

describe('loadCustomRockets', () => {
  it('hydrates custom rockets from localStorage', () => {
    localStorage.setItem('custom-rockets', JSON.stringify([apiRocket]))
    const store = useRocketsStore()
    store.loadCustomRockets()
    expect(store.customRockets).toHaveLength(1)
    expect(store.customRockets[0].name).toBe('Falcon 1')
  })
})
