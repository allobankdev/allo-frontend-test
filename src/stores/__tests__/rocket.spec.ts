import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRocketStore, type NewRocketInput } from '../rocket'
import { ApiError, fetchRocketById, fetchRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

vi.mock('@/services/rocketApi', async importOriginal => ({
  ...(await importOriginal<typeof import('@/services/rocketApi')>()),
  fetchRockets: vi.fn(),
  fetchRocketById: vi.fn(),
}))

const fetchRocketsMock = vi.mocked(fetchRockets)
const fetchRocketByIdMock = vi.mocked(fetchRocketById)

function makeRocket (id: string, name = `Rocket ${id}`): Rocket {
  return {
    id,
    name,
    description: null,
    imageUrl: null,
    launchCost: null,
    countryCode: null,
    maidenFlight: null,
  }
}

const newRocket: NewRocketInput = {
  name: 'Rocket Baru',
  description: 'Buatan pengguna',
  imageUrl: null,
  launchCost: 1000,
  countryCode: 'IDN',
  maidenFlight: null,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.resetAllMocks()
})

describe('loadRockets', () => {
  it('menyimpan hasil fetch dan berstatus success', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('1'), makeRocket('2')])
    const store = useRocketStore()

    const promise = store.loadRockets()
    expect(store.listStatus).toBe('loading')
    await promise

    expect(store.listStatus).toBe('success')
    expect(store.rockets.map(r => r.id)).toEqual(['1', '2'])
  })

  it('tidak fetch ulang jika data sudah dimuat', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('1')])
    const store = useRocketStore()

    await store.loadRockets()
    await store.loadRockets()

    expect(fetchRocketsMock).toHaveBeenCalledTimes(1)
  })

  it('menggabungkan pemanggilan bersamaan menjadi satu request', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('1')])
    const store = useRocketStore()

    await Promise.all([store.loadRockets(), store.loadRockets()])

    expect(fetchRocketsMock).toHaveBeenCalledTimes(1)
  })

  it('berstatus error dengan pesan, lalu pulih saat retry dengan force', async () => {
    fetchRocketsMock.mockRejectedValueOnce(new ApiError(429))
    const store = useRocketStore()

    await store.loadRockets()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toContain('Batas request API')

    fetchRocketsMock.mockResolvedValueOnce([makeRocket('1')])
    await store.loadRockets({ force: true })

    expect(store.listStatus).toBe('success')
    expect(store.listError).toBeNull()
  })
})

describe('addRocket', () => {
  it('menambah rocket dengan id lokal unik di urutan teratas', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('1')])
    const store = useRocketStore()
    await store.loadRockets()

    const first = store.addRocket(newRocket)
    const second = store.addRocket(newRocket)

    expect(first.id).toMatch(/^custom-/)
    expect(first.id).not.toBe(second.id)
    expect(store.rockets.map(r => r.id)).toEqual([second.id, first.id, '1'])
  })
})

describe('filteredRockets', () => {
  it('menyaring rocket API dan rocket tambahan berdasarkan searchQuery', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('1', 'Falcon 9'), makeRocket('2', 'Starship')])
    const store = useRocketStore()
    await store.loadRockets()
    store.addRocket(newRocket)

    store.searchQuery = 'falcon'
    expect(store.filteredRockets.map(r => r.name)).toEqual(['Falcon 9'])

    store.searchQuery = 'baru'
    expect(store.filteredRockets.map(r => r.name)).toEqual(['Rocket Baru'])
  })
})

describe('loadRocketById', () => {
  it('memakai data list tanpa request detail', async () => {
    fetchRocketsMock.mockResolvedValue([makeRocket('164')])
    const store = useRocketStore()
    await store.loadRockets()

    const rocket = await store.loadRocketById('164')

    expect(rocket.id).toBe('164')
    expect(fetchRocketByIdMock).not.toHaveBeenCalled()
  })

  it('mengembalikan rocket tambahan pengguna tanpa request', async () => {
    const store = useRocketStore()
    const added = store.addRocket(newRocket)

    await expect(store.loadRocketById(added.id)).resolves.toEqual(added)
    expect(fetchRocketByIdMock).not.toHaveBeenCalled()
  })

  it('fetch detail jika belum ada di cache, lalu menyimpannya', async () => {
    fetchRocketByIdMock.mockResolvedValue(makeRocket('161'))
    const store = useRocketStore()

    await store.loadRocketById('161')
    await store.loadRocketById('161')

    expect(fetchRocketByIdMock).toHaveBeenCalledTimes(1)
    expect(store.findRocket('161')?.id).toBe('161')
  })

  it('melempar 404 untuk id rocket tambahan yang sudah hilang tanpa request', async () => {
    const store = useRocketStore()

    await expect(store.loadRocketById('custom-hilang')).rejects.toMatchObject({ status: 404 })
    expect(fetchRocketByIdMock).not.toHaveBeenCalled()
  })
})
