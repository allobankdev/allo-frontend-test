import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/api/ll2', () => ({
  fetchLaunchers: vi.fn(),
  fetchLauncherById: vi.fn(),
}))

import { fetchLaunchers, fetchLauncherById } from '@/api/ll2'
import { useLaunchersStore } from '@/stores/launchers'
import type { Launcher } from '@/types/ll2'

const mockedList = vi.mocked(fetchLaunchers)
const mockedById = vi.mocked(fetchLauncherById)

const STORAGE_KEY = 'allo-launchers:local'

function rocket(id: number, full_name: string, country_code?: string): Launcher {
  return {
    id,
    full_name,
    description: `${full_name} description`,
    manufacturer: { name: 'SpaceX', country_code },
  }
}

function freshStore() {
  setActivePinia(createPinia())
  return useLaunchersStore()
}

beforeEach(() => {
  vi.clearAllMocks()
  mockedList.mockResolvedValue([])
})

describe('launchers store — local rocket persistence', () => {
  it('adds a rocket on top of the list and writes it to storage', () => {
    const store = freshStore()
    const added = rocket(1, 'My Garage Rocket')

    store.addLocal(added)

    expect(store.items[0]?.id).toBe(1)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Launcher[]
    expect(stored).toHaveLength(1)
    expect(stored[0]?.full_name).toBe('My Garage Rocket')
  })

  it('hydrates stored rockets ahead of the API list after a reload', async () => {
    const first = freshStore()
    first.addLocal(rocket(1, 'My Garage Rocket'))

    mockedList.mockResolvedValue([rocket(2, 'Falcon 9'), rocket(3, 'Falcon Heavy')])

    const reloaded = freshStore()
    await reloaded.loadList()

    expect(reloaded.items.map(r => r.id)).toEqual([1, 2, 3])
    expect(reloaded.listState).toBe('success')
  })

  it('discards corrupt storage payloads and still loads the API list', async () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json')
    mockedList.mockResolvedValue([rocket(2, 'Falcon 9')])

    const store = freshStore()
    await store.loadList()

    expect(store.items.map(r => r.id)).toEqual([2])
    expect(store.listState).toBe('success')
  })

  it('skips stored entries that are not launcher-shaped', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { id: 'no-name' },
      { id: 9, full_name: 'Valid Local Rocket' },
    ]))
    mockedList.mockResolvedValue([])

    const store = freshStore()
    await store.loadList()

    expect(store.items.map(r => r.full_name)).toEqual(['Valid Local Rocket'])
  })
})

describe('launchers store — filtered getter', () => {
  const seeded = [
    rocket(1, 'Falcon 1'),
    rocket(2, 'Starship', 'US'),
    rocket(3, 'Falcon Heavy', 'US'),
  ]

  it('matches the query against name and description, case-insensitively', () => {
    const store = freshStore()
    store.items = seeded.map(r => ({ ...r }))

    expect(store.filtered({ query: '  FALCON ' }).map(r => r.id)).toEqual([1, 3])
    expect(store.filtered({ query: 'starship description' }).map(r => r.id)).toEqual([2])
    expect(store.filtered({ query: 'nothing matches' })).toEqual([])
    expect(store.filtered({ query: '' })).toHaveLength(3)
    // Vuetify clearable fields emit null when cleared
    expect(store.filtered({ query: null })).toHaveLength(3)
  })

  it('filters by country code case-insensitively', () => {
    const store = freshStore()
    store.items = seeded.map(r => ({ ...r }))

    expect(store.filtered({ query: '', country: 'us' }).map(r => r.id)).toEqual([2, 3])
    expect(store.filtered({ query: '', country: 'DE' })).toEqual([])
  })

  it('composes query, country, and sort', () => {
    const store = freshStore()
    store.items = seeded.map(r => ({ ...r }))

    const result = store.filtered({ query: 'falcon', country: 'US', sort: 'desc' })
    expect(result.map(r => r.full_name)).toEqual(['Falcon Heavy'])
  })

  it('sorts by name without mutating the underlying list', () => {
    const store = freshStore()
    store.items = [
      rocket(1, 'Zephyr'),
      rocket(2, 'Alpha'),
      rocket(3, 'Midway'),
    ]

    expect(store.filtered({ query: '', sort: 'asc' }).map(r => r.full_name))
      .toEqual(['Alpha', 'Midway', 'Zephyr'])
    expect(store.filtered({ query: '', sort: 'desc' }).map(r => r.full_name))
      .toEqual(['Zephyr', 'Midway', 'Alpha'])
    expect(store.items.map(r => r.full_name)).toEqual(['Zephyr', 'Alpha', 'Midway'])
  })

  it('derives the country options from the loaded list, uppercased', () => {
    const store = freshStore()
    store.items = [
      rocket(1, 'A', 'US'),
      rocket(2, 'B'),
      rocket(3, 'C', 'FR'),
      rocket(4, 'D', 'us'),
    ]

    expect(store.countries).toEqual(['FR', 'US'])
  })
})

describe('launchers store — detail loading', () => {
  it('resolves a locally-added rocket without hitting the API', async () => {
    const store = freshStore()
    store.addLocal(rocket(1, 'My Garage Rocket'))

    await store.loadOne('1')

    expect(mockedById).not.toHaveBeenCalled()
    expect(store.detailById['1']?.full_name).toBe('My Garage Rocket')
    expect(store.detailState['1']).toBe('success')
  })

  it('resolves a stored rocket from storage even before the list is fetched', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([rocket(1, 'My Garage Rocket')]))
    const store = freshStore()
    expect(store.items).toEqual([])

    await store.loadOne('1')

    expect(mockedById).not.toHaveBeenCalled()
    expect(store.detailById['1']?.full_name).toBe('My Garage Rocket')
  })

  it('fetches API rockets once and caches the result', async () => {
    mockedById.mockResolvedValue(rocket(2, 'Falcon 9'))
    const store = freshStore()

    await store.loadOne('2')
    await store.loadOne('2')

    expect(mockedById).toHaveBeenCalledTimes(1)
    expect(store.detailState['2']).toBe('success')
  })

  it('records the error message when the API rocket fetch fails', async () => {
    mockedById.mockRejectedValue(new Error('HTTP 500 for https://example.com'))
    const store = freshStore()

    await store.loadOne('2')

    expect(store.detailState['2']).toBe('error')
    expect(store.detailError['2']).toContain('HTTP 500')
  })

  it('stops an in-flight list fetch from triggering a second request', async () => {
    let resolveList!: (value: Launcher[]) => void
    mockedList.mockReturnValue(new Promise(resolve => { resolveList = resolve }))

    const store = freshStore()
    const first = store.loadList()
    const second = store.loadList()
    resolveList([rocket(1, 'Falcon 9')])
    await Promise.all([first, second])

    expect(mockedList).toHaveBeenCalledTimes(1)
  })

  it('caches a successful list fetch instead of refetching on remount', async () => {
    mockedList.mockResolvedValue([rocket(1, 'Falcon 9')])

    const store = freshStore()
    await store.loadList()
    await store.loadList()

    expect(mockedList).toHaveBeenCalledTimes(1)
    expect(store.items.map(r => r.id)).toEqual([1])
  })
})
