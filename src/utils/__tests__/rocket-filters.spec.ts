import { describe, expect, it } from 'vitest'
import { mapLauncherToRocket } from '@/mappers/rocket.mapper'
import {
  DEFAULT_FILTERS,
  filterRockets,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  type RocketFilters,
} from '@/utils/rocket-filters'

const rockets = [
  mapLauncherToRocket({ id: 1, name: 'Falcon 1', description: 'First rocket', active: false, reusable: false, launch_cost: '7000000', maiden_flight: '2006-03-24' }),
  mapLauncherToRocket({ id: 2, name: 'Falcon Heavy', description: 'Heavy lift', active: true, reusable: true, launch_cost: '90000000', maiden_flight: '2018-02-06' }),
  mapLauncherToRocket({ id: 3, name: 'Starship', description: null, active: true, reusable: true, launch_cost: null, maiden_flight: null }),
]

const ids = (list: { id: string }[]) => list.map(r => r.id)
const withFilters = (patch: Partial<RocketFilters>) => ({ ...DEFAULT_FILTERS, ...patch })

describe('filterRockets', () => {
  it('returns everything in original order with default filters', () => {
    expect(ids(filterRockets(rockets, DEFAULT_FILTERS))).toEqual(['1', '2', '3'])
  })

  it('searches name and description case-insensitively', () => {
    expect(ids(filterRockets(rockets, withFilters({ query: 'HEAVY' })))).toEqual(['2'])
    expect(ids(filterRockets(rockets, withFilters({ query: 'first rocket' })))).toEqual(['1'])
  })

  it('filters by status and reusability', () => {
    expect(ids(filterRockets(rockets, withFilters({ status: 'retired' })))).toEqual(['1'])
    expect(ids(filterRockets(rockets, withFilters({ status: 'active' })))).toEqual(['2', '3'])
    expect(ids(filterRockets(rockets, withFilters({ reusableOnly: true })))).toEqual(['2', '3'])
  })

  it('sorts with missing values last in both directions', () => {
    expect(ids(filterRockets(rockets, withFilters({ sort: 'cost-asc' })))).toEqual(['1', '2', '3'])
    expect(ids(filterRockets(rockets, withFilters({ sort: 'cost-desc' })))).toEqual(['2', '1', '3'])
    expect(ids(filterRockets(rockets, withFilters({ sort: 'first-flight-desc' })))).toEqual(['2', '1', '3'])
    expect(ids(filterRockets(rockets, withFilters({ sort: 'name' })))).toEqual(['1', '2', '3'])
  })

  it('does not mutate the input array', () => {
    const input = [...rockets]
    filterRockets(input, withFilters({ sort: 'cost-desc' }))
    expect(ids(input)).toEqual(['1', '2', '3'])
  })
})

describe('URL query <-> filters', () => {
  it('round-trips non-default filters', () => {
    const filters = withFilters({ query: 'falcon', status: 'active', reusableOnly: true, sort: 'name' })
    const query = serializeFilters(filters)

    expect(query).toEqual({ q: 'falcon', status: 'active', reusable: 'true', sort: 'name' })
    expect(parseFilters(query as Record<string, string>)).toEqual(filters)
  })

  it('omits defaults and ignores invalid values', () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toEqual({})
    expect(parseFilters({ status: 'exploded', sort: 'random' })).toEqual(DEFAULT_FILTERS)
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false)
    expect(hasActiveFilters(withFilters({ query: '  ' }))).toBe(false)
  })
})
