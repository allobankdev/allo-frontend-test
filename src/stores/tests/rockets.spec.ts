import { fetchRocketById, fetchRockets } from '@/services/rockets'
import type { Rocket } from '@/types/rocket'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ADDED_ROCKETS_STORAGE_KEY, matchesRocketFilter, useRocketStore } from '../rockets'

vi.mock('@/services/rockets', () => ({
    fetchRockets: vi.fn(),
    fetchRocketById: vi.fn(),
}))

function makeRocket(overrides: Partial<Rocket> = {}): Rocket {
    return {
        id: '164',
        name: 'Falcon 9 Block 5',
        description: 'The workhorse of the SpaceX fleet.',
        imageUrl: null,
        costPerLaunch: 52000000,
        country: 'USA',
        firstFlight: '2018-05-11',
        active: true,
        isLocal: false,
        ...overrides,
    }
}

const falcon9 = makeRocket()
const starship = makeRocket({ id: '528', name: 'Starship', description: 'Super heavy lift.', active: true })
const falcon1 = makeRocket({ id: '133', name: 'Falcon 1', description: 'The first one.', active: false })

beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchRockets).mockReset()
    vi.mocked(fetchRocketById).mockReset()
})

describe('loadRockets', () => {
    it('stores the fetched rockets and marks the request successful', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9, starship])
        const store = useRocketStore()

        await store.loadRockets()

        expect(store.status).toBe('success')
        expect(store.rockets).toHaveLength(2)
        expect(store.errorMessage).toBe('')
    })

    it('does not refetch when the data is already loaded', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9])
        const store = useRocketStore()

        await store.loadRockets()
        await store.loadRockets()

        expect(fetchRockets).toHaveBeenCalledTimes(1)
    })

    it('refetches when force is true', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9])
        const store = useRocketStore()

        await store.loadRockets()
        await store.loadRockets(true)

        expect(fetchRockets).toHaveBeenCalledTimes(2)
    })

    it('exposes the error message and keeps status on error', async () => {
        vi.mocked(fetchRockets).mockRejectedValue(new Error('Launch Library responded with 500.'))
        const store = useRocketStore()

        await store.loadRockets()

        expect(store.status).toBe('error')
        expect(store.errorMessage).toBe('Launch Library responded with 500.')
        expect(store.rockets).toHaveLength(0)
    })

    it('recovers after a failed load when the retry succeeds', async () => {
        vi.mocked(fetchRockets).mockRejectedValueOnce(new Error('network down'))
        vi.mocked(fetchRockets).mockResolvedValueOnce([falcon9])
        const store = useRocketStore()

        await store.loadRockets()
        expect(store.status).toBe('error')

        await store.loadRockets(true)
        expect(store.status).toBe('success')
        expect(store.rockets).toHaveLength(1)
    })
})

describe('getRocket', () => {
    it('returns a cached rocket without touching the API', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9])
        const store = useRocketStore()
        await store.loadRockets()

        const rocket = await store.getRocket('164')

        expect(rocket).toEqual(falcon9)
        expect(fetchRocketById).not.toHaveBeenCalled()
    })

    it('fetches and caches a rocket opened through a direct link', async () => {
        vi.mocked(fetchRocketById).mockResolvedValue(starship)
        const store = useRocketStore()

        const rocket = await store.getRocket('528')

        expect(rocket).toEqual(starship)
        expect(fetchRocketById).toHaveBeenCalledWith('528')
        expect(store.rockets.map((item) => item.id)).toEqual(['528'])
    })
})

describe('addRocket', () => {
    it('prepends the new rocket and marks it as local', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9])
        const store = useRocketStore()
        await store.loadRockets()

        const created = store.addRocket({
            name: 'Nusantara HLV',
            description: 'A medium-heavy launch vehicle.',
            country: 'IDN',
            costPerLaunch: 68000000,
        })

        expect(created.isLocal).toBe(true)
        expect(store.rockets).toHaveLength(2)
        expect(store.rockets[0]?.name).toBe('Nusantara HLV')
    })

    it('trims input and turns empty optional fields into null', () => {
        const store = useRocketStore()

        const created = store.addRocket({ name: '  Nusantara HLV  ', description: ' demo ', imageUrl: '  ' })

        expect(created.name).toBe('Nusantara HLV')
        expect(created.imageUrl).toBeNull()
        expect(created.costPerLaunch).toBeNull()
    })

    it('marks the rocket as active when no status is provided', () => {
        const store = useRocketStore()

        const created = store.addRocket({ name: 'Falcon 9', description: 'The workhorse fleet.' })

        expect(created.active).toBe(true)
    })

    it('keeps a rocket inactive when active is false', () => {
        const store = useRocketStore()

        const created = store.addRocket({
            name: 'Falcon 1',
            description: 'The retired first rocket.',
            active: false,
        })

        expect(created.active).toBe(false)
    })
})

describe('filtering', () => {
    it('matches name or description, case-insensitively', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9, starship, falcon1])
        const store = useRocketStore()
        await store.loadRockets()

        store.searchQuery = 'FALCON'

        expect(store.filteredRockets.map((rocket) => rocket.id)).toEqual(['164', '133'])
    })

    it('filters by active status', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9, starship, falcon1])
        const store = useRocketStore()
        await store.loadRockets()

        store.statusFilter = 'retired'

        expect(store.filteredRockets.map((rocket) => rocket.id)).toEqual(['133'])
    })

    it('combines the search query with the status filter', async () => {
        vi.mocked(fetchRockets).mockResolvedValue([falcon9, starship, falcon1])
        const store = useRocketStore()
        await store.loadRockets()

        store.searchQuery = 'falcon'
        store.statusFilter = 'active'

        expect(store.filteredRockets.map((rocket) => rocket.id)).toEqual(['164'])
    })

    it('includes locally added rockets in the filter results', () => {
        const store = useRocketStore()
        store.addRocket({ name: 'Nusantara HLV', description: 'A medium-heavy launch vehicle.' })

        store.searchQuery = 'nusantara'

        expect(store.filteredRockets).toHaveLength(1)
    })

    it('reports when a filter is active and resets it', () => {
        const store = useRocketStore()

        store.searchQuery = 'falcon'
        expect(store.hasActiveFilter).toBe(true)

        store.resetFilters()
        expect(store.hasActiveFilter).toBe(false)
        expect(store.searchQuery).toBe('')
        expect(store.statusFilter).toBe('all')
    })

    it('treats a blank query as no filter', () => {
        expect(matchesRocketFilter(falcon9, '   ', 'all')).toBe(true)
    })
})

function createStorageMock(): Storage {
    const data = new Map<string, string>()

    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => {
            data.set(key, value)
        },
        removeItem: (key: string) => {
            data.delete(key)
        },
        clear: () => data.clear(),
        key: (index: number) => [...data.keys()][index] ?? null,
        get length() {
            return data.size
        },
    }
}

describe('added rocket persistence', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createStorageMock())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('restores rockets added in a previous session', async () => {
        const first = useRocketStore()
        const created = first.addRocket({
            name: 'Nusantara HLV',
            description: 'A medium-heavy launch vehicle.',
            country: 'IDN',
        })
        await nextTick()

        setActivePinia(createPinia())
        const second = useRocketStore()

        expect(second.rockets.map((rocket) => rocket.id)).toContain(created.id)
        expect(second.rockets[0]?.name).toBe('Nusantara HLV')
        expect(second.rockets[0]?.isLocal).toBe(true)
    })

    it('persists the rocket so its detail page works after a reload', async () => {
        const first = useRocketStore()
        const created = first.addRocket({ name: 'Nusantara HLV', description: 'Demo rocket.' })
        await nextTick()

        setActivePinia(createPinia())
        const second = useRocketStore()

        await expect(second.getRocket(created.id)).resolves.toMatchObject({ id: created.id })
        expect(fetchRocketById).not.toHaveBeenCalled()
    })

    it('ignores a corrupted storage payload instead of crashing', () => {
        localStorage.setItem(ADDED_ROCKETS_STORAGE_KEY, '{not json')

        const store = useRocketStore()

        expect(store.rockets).toEqual([])
    })

    it('drops entries that do not look like a rocket', () => {
        localStorage.setItem(ADDED_ROCKETS_STORAGE_KEY, JSON.stringify([
            { id: 'local-1', name: 'Valid', description: 'Kept.' },
            { id: 42, name: 'Invalid', description: 'Missing string id.' },
            null,
        ]))

        const store = useRocketStore()

        expect(store.rockets.map((rocket) => rocket.id)).toEqual(['local-1'])
    })

    it('normalises missing optional fields on restored rockets', () => {
        localStorage.setItem(ADDED_ROCKETS_STORAGE_KEY, JSON.stringify([
            { id: 'local-2', name: 'Sparse', description: 'Only the required fields.' },
        ]))

        const store = useRocketStore()

        expect(store.rockets[0]).toMatchObject({
            imageUrl: null,
            costPerLaunch: null,
            country: null,
            firstFlight: null,
            active: false,
            isLocal: true,
        })
    })

    it('keeps working when the browser blocks storage', () => {
        vi.stubGlobal('localStorage', {
            getItem: () => {
                throw new Error('blocked')
            },
            setItem: () => {
                throw new Error('blocked')
            },
        })

        const store = useRocketStore()

        expect(() => store.addRocket({ name: 'Offline rocket', description: 'Still in memory.' })).not.toThrow()
        expect(store.rockets).toHaveLength(1)
    })
})
