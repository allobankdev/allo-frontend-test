import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getRocket, getRockets } from '@/services/rocketApi'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'

vi.mock('@/services/rocketApi', () => ({
  getRocket: vi.fn(),
  getRockets: vi.fn(),
}))

const falcon: Rocket = {
  id: 164,
  full_name: 'Falcon 9 Block 5',
  description: 'Reusable launch vehicle',
  image_url: 'https://example.com/falcon.jpg',
  launch_cost: '67000000',
  maiden_flight: '2018-05-11',
  manufacturer: { country_code: 'USA' },
}

describe('rocket store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads the remote catalog and exposes a success state', async () => {
    vi.mocked(getRockets).mockResolvedValue([falcon])
    const store = useRocketStore()

    await store.loadRockets()

    expect(store.listStatus).toBe('success')
    expect(store.listError).toBeNull()
    expect(store.rockets).toEqual([falcon])
  })

  it('recovers from a failed list request when retrying', async () => {
    vi.mocked(getRockets)
      .mockRejectedValueOnce(new Error('Service unavailable'))
      .mockResolvedValueOnce([falcon])
    const store = useRocketStore()

    await store.loadRockets()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe('Service unavailable')

    await store.loadRockets({ force: true })
    expect(store.listStatus).toBe('success')
    expect(store.rockets).toEqual([falcon])
  })

  it('keeps a locally added rocket available on the detail screen', async () => {
    const store = useRocketStore()
    const localRocket = store.addRocket({
      fullName: 'Test Vehicle',
      description: '',
      imageUrl: '',
      launchCost: '',
      countryCode: 'idn',
      maidenFlight: '',
    })

    await store.loadRocket(localRocket.id)

    expect(store.rockets[0]).toMatchObject({
      full_name: 'Test Vehicle',
      is_local: true,
      manufacturer: { country_code: 'IDN' },
    })
    expect(store.findRocket(localRocket.id)).toEqual(localRocket)
    expect(store.getDetailState(localRocket.id).status).toBe('success')
    expect(getRocket).not.toHaveBeenCalled()
  })

  it('uses the single-rocket service for remote detail data', async () => {
    vi.mocked(getRocket).mockResolvedValue(falcon)
    const store = useRocketStore()

    await store.loadRocket(falcon.id)

    expect(getRocket).toHaveBeenCalledWith(falcon.id, undefined)
    expect(store.findRocket(falcon.id)).toEqual(falcon)
    expect(store.getDetailState(falcon.id).status).toBe('success')
  })
})
