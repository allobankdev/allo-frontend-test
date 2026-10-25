import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRocketStore } from '../useRocketStore'
import type { LauncherDto } from '@/types/rocket'

const { getRocketList } = vi.hoisted(() => ({ getRocketList: vi.fn() }))

vi.mock('@/services/rocketApi', async importOriginal => {
  const actual = await importOriginal<typeof import('@/services/rocketApi')>()
  return { ...actual, getRocketList }
})

function makeDto (overrides: Partial<LauncherDto> = {}): LauncherDto {
  return {
    id: 1,
    full_name: 'Falcon 1',
    description: 'A rocket',
    launch_cost: '1000',
    maiden_flight: '2020-01-01',
    image_url: null,
    manufacturer: { country_code: 'USA' },
    ...overrides,
  }
}

describe('useRocketStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getRocketList.mockReset()
  })

  it('starts idle with an empty list', () => {
    const store = useRocketStore()
    expect(store.status).toBe('idle')
    expect(store.rockets).toEqual([])
  })

  it('fetchRockets populates the list and flips status to success', async () => {
    getRocketList.mockResolvedValue([
      makeDto({ id: 1, full_name: 'Falcon 1' }),
      makeDto({ id: 2, full_name: 'Falcon Heavy' }),
    ])

    const store = useRocketStore()
    await store.fetchRockets()

    expect(store.status).toBe('success')
    expect(store.rockets).toHaveLength(2)
    expect(store.rockets.map(r => r.name)).toEqual(['Falcon 1', 'Falcon Heavy'])
  })

  it('sets status to error with the failure message when the request rejects', async () => {
    getRocketList.mockRejectedValue(new Error('Network down'))

    const store = useRocketStore()
    await store.fetchRockets()

    expect(store.status).toBe('error')
    expect(store.errorMessage).toBe('Network down')
    expect(store.rockets).toEqual([])
  })

  it('skips a second fetchRockets call while one is already in flight', async () => {
    let resolveFetch: (dtos: LauncherDto[]) => void = () => {}
    getRocketList.mockReturnValue(new Promise(resolve => {
      resolveFetch = resolve
    }))

    const store = useRocketStore()
    const first = store.fetchRockets()
    const second = store.fetchRockets() // should be a no-op, guarded by status === 'loading'

    resolveFetch([makeDto()])
    await Promise.all([first, second])

    expect(getRocketList).toHaveBeenCalledTimes(1)
  })

  describe('filteredRockets', () => {
    it('matches case-insensitively against the rocket name', async () => {
      getRocketList.mockResolvedValue([
        makeDto({ id: 1, full_name: 'Falcon 1' }),
        makeDto({ id: 2, full_name: 'Starship' }),
      ])

      const store = useRocketStore()
      await store.fetchRockets()
      store.filterText = 'FALCON'

      expect(store.filteredRockets.map(r => r.name)).toEqual(['Falcon 1'])
    })

    it('returns every rocket when the filter is empty', async () => {
      getRocketList.mockResolvedValue([makeDto({ id: 1 }), makeDto({ id: 2 })])

      const store = useRocketStore()
      await store.fetchRockets()

      expect(store.filteredRockets).toHaveLength(2)
    })
  })

  describe('addRocket', () => {
    it('assigns a local- prefixed id and marks the rocket as local', () => {
      const store = useRocketStore()
      const added = store.addRocket({ name: 'Custom Rocket' })

      expect(added.id.startsWith('local-')).toBe(true)
      expect(added.isLocal).toBe(true)
      expect(added.name).toBe('Custom Rocket')
    })

    it('assigns unique ids across multiple calls', () => {
      const store = useRocketStore()
      const first = store.addRocket({ name: 'Rocket A' })
      const second = store.addRocket({ name: 'Rocket B' })

      expect(first.id).not.toBe(second.id)
    })

    it('prepends the new rocket so it appears first in the list', () => {
      const store = useRocketStore()
      store.addRocket({ name: 'Rocket A' })
      store.addRocket({ name: 'Rocket B' })

      expect(store.rockets[0].name).toBe('Rocket B')
    })

    it('defaults missing optional fields to null, not undefined', () => {
      const store = useRocketStore()
      const added = store.addRocket({ name: 'Minimal Rocket' })

      expect(added.description).toBeNull()
      expect(added.imageUrl).toBeNull()
      expect(added.costPerLaunch).toBeNull()
      expect(added.country).toBeNull()
      expect(added.firstFlight).toBeNull()
    })

    it('survives a subsequent fetchRockets() call instead of being dropped', async () => {
      getRocketList.mockResolvedValue([makeDto({ id: 1, full_name: 'Falcon 1' })])

      const store = useRocketStore()
      await store.fetchRockets()
      store.addRocket({ name: 'Custom Rocket' })
      expect(store.rockets).toHaveLength(2)

      await store.fetchRockets()

      expect(store.rockets).toHaveLength(2)
      expect(store.rockets.some(r => r.name === 'Custom Rocket')).toBe(true)
    })
  })

  describe('rocketById', () => {
    it('finds a rocket by id', async () => {
      getRocketList.mockResolvedValue([makeDto({ id: 42, full_name: 'Falcon 1' })])

      const store = useRocketStore()
      await store.fetchRockets()

      expect(store.rocketById('42')?.name).toBe('Falcon 1')
    })

    it('returns undefined for an id that does not exist', () => {
      const store = useRocketStore()
      expect(store.rocketById('does-not-exist')).toBeUndefined()
    })
  })
})
