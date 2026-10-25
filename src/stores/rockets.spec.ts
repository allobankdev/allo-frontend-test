import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRocketsStore } from './rockets'
import { makeRocket } from '@/test/rocket-fixture'

vi.mock('@/api/rockets', () => ({
  fetchRockets: vi.fn(),
}))

import { fetchRockets } from '@/api/rockets'

describe('rockets store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchRockets).mockReset()
  })

  it('starts empty and not loaded', () => {
    const store = useRocketsStore()

    expect(store.rockets).toEqual([])
    expect(store.loaded).toBe(false)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(false)
  })

  it('populates rockets and marks loaded on a successful fetch', async () => {
    const rockets = [makeRocket({ id: 1 }), makeRocket({ id: 2 })]
    vi.mocked(fetchRockets).mockResolvedValue(rockets)

    const store = useRocketsStore()
    await store.fetchRockets()

    expect(store.rockets).toEqual(rockets)
    expect(store.loaded).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(false)
  })

  it('sets error and leaves loaded false when the fetch fails', async () => {
    vi.mocked(fetchRockets).mockRejectedValue(new Error('network down'))

    const store = useRocketsStore()
    await store.fetchRockets()

    expect(store.error).toBe(true)
    expect(store.loaded).toBe(false)
    expect(store.loading).toBe(false)
    expect(store.rockets).toEqual([])
  })

  it('toggles loading to true while the fetch is in flight', async () => {
    let resolveFetch: (rockets: ReturnType<typeof makeRocket>[]) => void
    vi.mocked(fetchRockets).mockReturnValue(new Promise(resolve => {
      resolveFetch = resolve
    }))

    const store = useRocketsStore()
    const pending = store.fetchRockets()

    expect(store.loading).toBe(true)

    resolveFetch!([])
    await pending

    expect(store.loading).toBe(false)
  })

  it('adds a rocket to the front of the list', () => {
    const store = useRocketsStore()
    store.rockets = [makeRocket({ id: 1, full_name: 'Falcon 1' })]

    store.addRocket(makeRocket({ id: 2, full_name: 'Custom Rocket' }))

    expect(store.rockets.map(r => r.full_name)).toEqual(['Custom Rocket', 'Falcon 1'])
  })
})
