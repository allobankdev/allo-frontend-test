/**
 * Pure filter/sort logic for the rocket list, plus (de)serialization to the
 * URL query so filters survive reloads and can be shared as links.
 */

import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { Rocket } from '@/types/rocket'

export const STATUS_FILTERS = ['all', 'active', 'retired'] as const
export type StatusFilter = (typeof STATUS_FILTERS)[number]

export const SORT_KEYS = ['default', 'name', 'first-flight-desc', 'first-flight-asc', 'cost-asc', 'cost-desc'] as const
export type SortKey = (typeof SORT_KEYS)[number]

export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey, title: string }> = [
  { value: 'default', title: 'Recommended' },
  { value: 'name', title: 'Name (A–Z)' },
  { value: 'first-flight-desc', title: 'Newest first flight' },
  { value: 'first-flight-asc', title: 'Oldest first flight' },
  { value: 'cost-asc', title: 'Lowest cost' },
  { value: 'cost-desc', title: 'Highest cost' },
]

export interface RocketFilters {
  query: string
  status: StatusFilter
  reusableOnly: boolean
  sort: SortKey
}

export const DEFAULT_FILTERS: Readonly<RocketFilters> = {
  query: '',
  status: 'all',
  reusableOnly: false,
  sort: 'default',
}

// ── Filtering ──────────────────────────────────────────────────────────────

export function filterRockets (rockets: readonly Rocket[], filters: RocketFilters): Rocket[] {
  const query = filters.query.trim().toLowerCase()

  const matches = rockets.filter(rocket =>
    matchesQuery(rocket, query) &&
    matchesStatus(rocket, filters.status) &&
    (!filters.reusableOnly || rocket.isReusable === true),
  )

  return sortRockets(matches, filters.sort)
}

function matchesQuery (rocket: Rocket, query: string): boolean {
  if (!query) return true
  return [rocket.name, rocket.family, rocket.description]
    .some(text => text?.toLowerCase().includes(query))
}

function matchesStatus (rocket: Rocket, status: StatusFilter): boolean {
  if (status === 'active') return rocket.isActive === true
  if (status === 'retired') return rocket.isActive === false
  return true
}

// ── Sorting (missing values always go last) ────────────────────────────────

function sortRockets (rockets: Rocket[], sort: SortKey): Rocket[] {
  switch (sort) {
    case 'name':
      return [...rockets].sort((a, b) => a.name.localeCompare(b.name))
    case 'first-flight-asc':
      return [...rockets].sort(byNullableLast(r => r.firstFlight, 'asc'))
    case 'first-flight-desc':
      return [...rockets].sort(byNullableLast(r => r.firstFlight, 'desc'))
    case 'cost-asc':
      return [...rockets].sort(byNullableLast(r => r.launchCost, 'asc'))
    case 'cost-desc':
      return [...rockets].sort(byNullableLast(r => r.launchCost, 'desc'))
    default:
      return rockets
  }
}

function byNullableLast<T extends string | number> (
  pick: (rocket: Rocket) => T | null,
  direction: 'asc' | 'desc',
) {
  return (a: Rocket, b: Rocket): number => {
    const left = pick(a)
    const right = pick(b)
    if (left === null && right === null) return 0
    if (left === null) return 1
    if (right === null) return -1
    const order = left < right ? -1 : left > right ? 1 : 0
    return direction === 'asc' ? order : -order
  }
}

// ── URL query ⇄ filters ───────────────────────────────────────────────────

export function parseFilters (query: LocationQuery): RocketFilters {
  const status = firstValue(query.status)
  const sort = firstValue(query.sort)
  return {
    query: firstValue(query.q) ?? '',
    status: isOneOf(STATUS_FILTERS, status) ? status : DEFAULT_FILTERS.status,
    reusableOnly: firstValue(query.reusable) === 'true',
    sort: isOneOf(SORT_KEYS, sort) ? sort : DEFAULT_FILTERS.sort,
  }
}

/** Only non-default values are written, which keeps URLs short. */
export function serializeFilters (filters: RocketFilters): LocationQueryRaw {
  const query: LocationQueryRaw = {}
  const text = filters.query.trim()
  if (text) query.q = text
  if (filters.status !== DEFAULT_FILTERS.status) query.status = filters.status
  if (filters.reusableOnly) query.reusable = 'true'
  if (filters.sort !== DEFAULT_FILTERS.sort) query.sort = filters.sort
  return query
}

export function hasActiveFilters (filters: RocketFilters): boolean {
  return Object.keys(serializeFilters(filters)).length > 0
}

function firstValue (value: LocationQuery[string] | undefined): string | null {
  const first = Array.isArray(value) ? value[0] : value
  return first ?? null
}

function isOneOf<T extends string> (allowed: readonly T[], value: string | null): value is T {
  return value !== null && (allowed as readonly string[]).includes(value)
}
