import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { useRocketFilters } from './useRocketFilters'
import { useRocketsStore } from '@/stores/rockets'
import { makeRocket } from '@/test/rocket-fixture'

async function mountFilters (initialPath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })
  router.push(initialPath)
  await router.isReady()

  let filters!: ReturnType<typeof useRocketFilters>
  const Host = defineComponent({
    setup () {
      filters = useRocketFilters()
      return () => null
    },
  })

  mount(Host, { global: { plugins: [router] } })

  return { router, filters }
}

describe('useRocketFilters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns every rocket when no filters are set', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 1' }),
      makeRocket({ id: 2, full_name: 'Falcon 9' }),
    ]

    const { filters } = await mountFilters()

    expect(filters.filteredRockets.value).toHaveLength(2)
  })

  it('filters by search text, case-insensitively', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 1' }),
      makeRocket({ id: 2, full_name: 'Starship' }),
    ]

    const { filters } = await mountFilters()
    filters.search.value = 'falcon'
    await flushPromises()

    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Falcon 1'])
  })

  it('filters by status', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Active One', active: true }),
      makeRocket({ id: 2, full_name: 'Retired One', active: false }),
    ]

    const { filters } = await mountFilters()
    filters.status.value = 'Retired'
    await flushPromises()

    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Retired One'])
  })

  it('filters by family', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 1', family: 'Falcon' }),
      makeRocket({ id: 2, full_name: 'Starship', family: 'Starship' }),
    ]

    const { filters } = await mountFilters()
    filters.family.value = 'Starship'
    await flushPromises()

    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Starship'])
  })

  it('filters by country', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 1', manufacturer: { name: 'SpaceX', country_code: 'USA' } }),
      makeRocket({ id: 2, full_name: 'Unknown Origin', manufacturer: null }),
    ]

    const { filters } = await mountFilters()
    filters.country.value = 'USA'
    await flushPromises()

    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Falcon 1'])
  })

  it('combines multiple filters with AND logic', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Starship V1', family: 'Starship', active: true }),
      makeRocket({ id: 2, full_name: 'Starship V2', family: 'Starship', active: false }),
      makeRocket({ id: 3, full_name: 'Falcon 9', family: 'Falcon', active: true }),
    ]

    const { filters } = await mountFilters()
    filters.family.value = 'Starship'
    await flushPromises()
    filters.status.value = 'Active'
    await flushPromises()

    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Starship V1'])
  })

  it('derives family options from the loaded rockets, deduplicated', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, family: 'Falcon' }),
      makeRocket({ id: 2, family: 'Falcon' }),
      makeRocket({ id: 3, family: 'Starship' }),
      makeRocket({ id: 4, family: null }),
    ]

    const { filters } = await mountFilters()

    expect(filters.familyOptions.value).toEqual(['All', 'Falcon', 'Starship'])
  })

  it('writes filter changes into the route query', async () => {
    const store = useRocketsStore()
    store.rockets = [makeRocket({ id: 1 })]

    const { router, filters } = await mountFilters()
    filters.search.value = 'falcon'
    await flushPromises()

    expect(router.currentRoute.value.query.q).toBe('falcon')
  })

  it('reads initial filter state from the route query', async () => {
    const store = useRocketsStore()
    store.rockets = [
      makeRocket({ id: 1, full_name: 'Falcon 1', active: true }),
      makeRocket({ id: 2, full_name: 'Falcon 9', active: false }),
    ]

    const { filters } = await mountFilters('/?status=Retired')

    expect(filters.status.value).toBe('Retired')
    expect(filters.filteredRockets.value.map(r => r.full_name)).toEqual(['Falcon 9'])
  })
})
