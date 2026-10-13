import type { Rocket } from '@/types/rocket'

export type RocketCountryFilter = 'all' | 'USA' | 'other'

export function filterRockets(
  rockets: Rocket[],
  query: string,
  countryFilter: RocketCountryFilter,
): Rocket[] {
  const searchTerm = query.trim().toLocaleLowerCase()

  return rockets.filter((rocket) => {
    const country = rocket.manufacturer?.country_code?.toUpperCase()
    const matchesCountry = countryFilter === 'all'
      || (countryFilter === 'USA' && country === 'USA')
      || (countryFilter === 'other' && country !== 'USA')
    const searchableText = `${rocket.full_name || ''} ${rocket.description || ''}`.toLocaleLowerCase()

    return matchesCountry && searchableText.includes(searchTerm)
  })
}

export function formatCost(cost?: string | number | null): string {
  if (cost == null || cost === '') return 'Not available'

  const amount = Number(cost)
  if (!Number.isFinite(amount)) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date?: string | null): string {
  if (!date) return 'Not available'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}
