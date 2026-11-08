import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ApiError } from '@/api/http'
import * as rocketsApi from '@/api/rockets.api'
import { useRocketsStore } from '@/stores/rockets'
import type { LauncherConfigDto } from '@/types/api'

vi.mock('@/api/rockets.api', () => ({
  getRockets: vi.fn(),
  getRocketById: vi.fn(),
}))

const getRockets = vi.mocked(rocketsApi.getRockets)
const getRocketById = vi.mocked(rocketsApi.getRocketById)

const dto = (id: number, name: string): LauncherConfigDto => ({ id, name, full_name: name })

describe('rockets store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('loads rockets and moves loading → success', async () => {
    getRockets.mockResolvedValue([dto(1, 'Falcon 1'), dto(2, 'Falcon 9')])
    const store = useRocketsStore()

    const request = store.fetchRockets()
    expect(store.listStatus).toBe('loading')
    await request

    expect(store.listStatus).toBe('success')
    expect(store.allRockets.map(r => r.name)).toEqual(['Falcon 1', 'Falcon 9'])
  })

  it('uses the cache unless forced', async () => {
    getRockets.mockResolvedValue([dto(1, 'Falcon 1')])
    const store = useRocketsStore()

    await store.fetchRockets()
    await store.fetchRockets()
    expect(getRockets).toHaveBeenCalledTimes(1)

    await store.fetchRockets({ force: true })
    expect(getRockets).toHaveBeenCalledTimes(2)
  })

  it('exposes a friendly error and recovers on retry', async () => {
    getRockets.mockRejectedValueOnce(new ApiError('rate-limit', 'Too many requests.', 429))
    getRockets.mockResolvedValueOnce([dto(1, 'Falcon 1')])
    const store = useRocketsStore()

    await store.fetchRockets()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe('Too many requests.')

    await store.fetchRockets({ force: true })
    expect(store.listStatus).toBe('success')
    expect(store.listError).toBeNull()
  })

  it('treats an aborted request as idle, not as an error', async () => {
    getRockets.mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    const store = useRocketsStore()

    await store.fetchRockets()
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
  })

  it('adds local rockets first and finds them by id', async () => {
    getRockets.mockResolvedValue([dto(1, 'Falcon 1')])
    const store = useRocketsStore()
    await store.fetchRockets()

    const added = store.addRocket({
      name: 'Nova',
      description: null,
      imageUrl: null,
      launchCost: null,
      countryCode: null,
      firstFlight: null,
      isActive: true,
      isReusable: false,
    })

    expect(store.allRockets[0].id).toBe(added.id)
    expect(store.getRocketById(added.id)?.name).toBe('Nova')
  })

  it('fetches a single rocket and caches it', async () => {
    getRocketById.mockResolvedValue(dto(164, 'Falcon 9 Block 5'))
    const store = useRocketsStore()

    const rocket = await store.fetchRocketById('164')

    expect(rocket.name).toBe('Falcon 9 Block 5')
    expect(store.getRocketById('164')?.name).toBe('Falcon 9 Block 5')
  })
})
