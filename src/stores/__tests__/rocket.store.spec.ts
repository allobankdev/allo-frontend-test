import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRocketStore } from '@/stores/rocket.store'

vi.mock('@/services/rocket.service', () => ({
  fetchRocketList: vi.fn(),
  fetchRocketById: vi.fn(),
}))

import { fetchRocketList, fetchRocketById as apiFetchById } from '@/services/rocket.service'

const mockRocket = {
  id: 1,
  name: 'Falcon 9',
  description: 'A reusable rocket.',
  imageUrl: 'https://example.com/f9.jpg',
  launchCost: '62000000',
  country: 'USA',
  maidenFlight: '2010-06-04',
  isLocal: false,
}

describe('useRocketStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchRockets', () => {
    it('loads rockets on success', async () => {
      vi.mocked(fetchRocketList).mockResolvedValueOnce([mockRocket])
      const store = useRocketStore()

      await store.fetchRockets()

      expect(store.rockets).toHaveLength(1)
      expect(store.rockets[0].name).toBe('Falcon 9')
      expect(store.initialized).toBe(true)
      expect(store.listLoading).toBe(false)
      expect(store.listError).toBeNull()
    })

    it('sets listError on failure', async () => {
      vi.mocked(fetchRocketList).mockRejectedValueOnce(new Error('Network error'))
      const store = useRocketStore()

      await store.fetchRockets()

      expect(store.listError).toBe('Network error')
      expect(store.rockets).toHaveLength(0)
      expect(store.initialized).toBe(false)
    })

    it('does not re-fetch when already initialized', async () => {
      vi.mocked(fetchRocketList).mockResolvedValueOnce([mockRocket])
      const store = useRocketStore()

      await store.fetchRockets()
      await store.fetchRockets()

      expect(fetchRocketList).toHaveBeenCalledTimes(1)
    })

    it('re-fetches when force = true', async () => {
      vi.mocked(fetchRocketList).mockResolvedValue([mockRocket])
      const store = useRocketStore()

      await store.fetchRockets()
      await store.fetchRockets(undefined, true)

      expect(fetchRocketList).toHaveBeenCalledTimes(2)
    })
  })

  describe('addRocket', () => {
    it('adds a new rocket with a local- prefixed id', () => {
      const store = useRocketStore()

      const added = store.addRocket({
        name: 'Test Rocket',
        description: 'My custom rocket',
        imageUrl: '',
        launchCost: '5000000',
        country: 'NLD',
        maidenFlight: '2024-01-01',
      })

      expect(added.id).toMatch(/^local-/)
      expect(added.isLocal).toBe(true)
      expect(added.name).toBe('Test Rocket')
      expect(store.rockets[0]).toEqual(added)
    })

    it('converts empty strings to null for optional fields', () => {
      const store = useRocketStore()

      const added = store.addRocket({
        name: 'Minimal Rocket',
        description: '',
        imageUrl: '',
        launchCost: '',
        country: '',
        maidenFlight: '',
      })

      expect(added.description).toBeNull()
      expect(added.imageUrl).toBeNull()
      expect(added.launchCost).toBeNull()
      expect(added.country).toBeNull()
      expect(added.maidenFlight).toBeNull()
    })

    it('makes the added rocket findable by id', () => {
      const store = useRocketStore()
      const added = store.addRocket({
        name: 'Findable',
        description: '',
        imageUrl: '',
        launchCost: '',
        country: '',
        maidenFlight: '',
      })

      expect(store.findRocketById(added.id)).toEqual(added)
    })
  })

  describe('fetchRocketById', () => {
    it('uses cached store data without calling API', async () => {
      vi.mocked(fetchRocketList).mockResolvedValueOnce([mockRocket])
      const store = useRocketStore()
      await store.fetchRockets()

      await store.fetchRocketById(1)

      expect(apiFetchById).not.toHaveBeenCalled()
      expect(store.selectedRocket?.name).toBe('Falcon 9')
    })

    it('calls API when rocket is not in store', async () => {
      vi.mocked(apiFetchById).mockResolvedValueOnce(mockRocket)
      const store = useRocketStore()

      await store.fetchRocketById(1)

      expect(apiFetchById).toHaveBeenCalledWith(1, undefined)
      expect(store.selectedRocket?.name).toBe('Falcon 9')
    })

    it('sets detailError for local- id not in store', async () => {
      const store = useRocketStore()

      await store.fetchRocketById('local-abc-123')

      expect(store.detailError).toBeTruthy()
      expect(store.selectedRocket).toBeNull()
      expect(apiFetchById).not.toHaveBeenCalled()
    })

    it('sets detailError on API failure', async () => {
      vi.mocked(apiFetchById).mockRejectedValueOnce(new Error('404 Not found'))
      const store = useRocketStore()

      await store.fetchRocketById(999)

      expect(store.detailError).toBe('404 Not found')
      expect(store.selectedRocket).toBeNull()
    })
  })

  describe('clearErrors', () => {
    it('clears both list and detail errors', async () => {
      vi.mocked(fetchRocketList).mockRejectedValueOnce(new Error('list err'))
      vi.mocked(apiFetchById).mockRejectedValueOnce(new Error('detail err'))
      const store = useRocketStore()

      await store.fetchRockets()
      await store.fetchRocketById(999)
      store.clearErrors()

      expect(store.listError).toBeNull()
      expect(store.detailError).toBeNull()
    })
  })
})
