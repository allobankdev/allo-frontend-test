import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick, ref } from 'vue'
import { useRocketDetail } from '../useRocketDetail'
import { useRocketStore } from '@/stores/rocket'
import { ApiError, fetchRocketById } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

vi.mock('@/services/rocketApi', async importOriginal => ({
  ...(await importOriginal<typeof import('@/services/rocketApi')>()),
  fetchRockets: vi.fn(),
  fetchRocketById: vi.fn(),
}))

const fetchRocketByIdMock = vi.mocked(fetchRocketById)

function makeRocket (id: string): Rocket {
  return {
    id,
    name: `Rocket ${id}`,
    description: null,
    imageUrl: null,
    launchCost: null,
    countryCode: null,
    maidenFlight: null,
  }
}

/** Menunggu promise yang sedang berjalan di composable selesai. */
const flush = () => new Promise(resolve => setTimeout(resolve))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.resetAllMocks()
})

describe('useRocketDetail', () => {
  it('langsung success tanpa request jika rocket ada di store', () => {
    const store = useRocketStore()
    const added = store.addRocket({ ...makeRocket('x'), name: 'Garuda I' })

    const { rocket, status } = useRocketDetail(added.id)

    expect(status.value).toBe('success')
    expect(rocket.value?.name).toBe('Garuda I')
    expect(fetchRocketByIdMock).not.toHaveBeenCalled()
  })

  it('berstatus loading lalu success saat rocket diambil dari API', async () => {
    fetchRocketByIdMock.mockResolvedValue(makeRocket('161'))

    const { rocket, status } = useRocketDetail('161')
    expect(status.value).toBe('loading')
    await flush()

    expect(status.value).toBe('success')
    expect(rocket.value?.id).toBe('161')
  })

  it('berstatus error dengan pesan, lalu pulih lewat retry', async () => {
    fetchRocketByIdMock.mockRejectedValueOnce(new ApiError(500))

    const { error, retry, status } = useRocketDetail('161')
    await flush()
    expect(status.value).toBe('error')
    expect(error.value).toContain('HTTP 500')

    fetchRocketByIdMock.mockResolvedValueOnce(makeRocket('161'))
    await retry()

    expect(status.value).toBe('success')
    expect(error.value).toBeNull()
  })

  it('memuat ulang saat id berubah dan mengabaikan respons lama', async () => {
    let resolveSlow: (value: Rocket) => void = () => {}
    fetchRocketByIdMock
      .mockReturnValueOnce(new Promise(resolve => {
        resolveSlow = resolve
      }))
      .mockResolvedValueOnce(makeRocket('2'))

    const id = ref('1')
    const { rocket } = useRocketDetail(id)

    id.value = '2'
    await nextTick()
    await flush()
    expect(rocket.value?.id).toBe('2')

    // Respons id lama yang datang terlambat tidak boleh menimpa rocket aktif.
    resolveSlow(makeRocket('1'))
    await flush()
    expect(rocket.value?.id).toBe('2')
  })
})
