import type { ActiveFilter, Rocket, RocketFilters } from '@/types/rocket'

export const DEFAULT_ROCKET_FILTERS: RocketFilters = { search: '', active: 'all' }

export function filterRockets (rockets: Rocket[], filters: RocketFilters): Rocket[] {
    const query = filters.search.trim().toLowerCase()

    return rockets.filter(rocket => matchesSearch(rocket, query) && matchesActive(rocket, filters.active))
}

function matchesSearch (rocket: Rocket, query: string): boolean {
    if (!query) return true   // kolom search kosong → semua lolos

    const name = rocket.name.toLowerCase()
    const description = rocket.description?.toLowerCase() ?? ''

    return name.includes(query) || description.includes(query)
}

function matchesActive (rocket: Rocket, active: ActiveFilter): boolean {
    if (active === 'all') return true
    if (active === 'active') return rocket.active === true
    return rocket.active === false   // 'inactive'
}