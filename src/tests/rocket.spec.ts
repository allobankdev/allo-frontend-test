import { describe, expect, it } from 'vitest'
import { mapRawRocket, type RawRocket } from '@/types/rocket'
import { formatCountry } from '@/utils/countries'
import { formatCurrency, formatDate } from '@/utils/format'

function buildRaw(overrides: Partial<RawRocket> = {}): RawRocket {
  return {
    id: 1,
    full_name: 'Falcon 9 Block 5',
    description: null,
    family: null,
    active: true,
    reusable: true,
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    manufacturer: null,
    ...overrides,
  }
}

describe('mapRawRocket', () => {
  it('maps a fully populated raw rocket correctly', () => {
    const raw = buildRaw({
      description: 'A reusable rocket.',
      image_url: 'https://example.com/falcon9.jpg',
      launch_cost: 50000000,
      maiden_flight: '2010-06-04',
      manufacturer: { country_code: 'USA' },
    })

    const result = mapRawRocket(raw)

    expect(result.id).toBe(1)
    expect(result.fullName).toBe('Falcon 9 Block 5')
    expect(result.description).toBe('A reusable rocket.')
    expect(result.imageUrl).toBe('https://example.com/falcon9.jpg')
    expect(result.launchCost).toBe(50000000)
    expect(result.countryCode).toBe('USA')
    expect(result.maidenFlight).toBe('2010-06-04')
    expect(result.isLocal).toBe(false)
  })

  it('falls back to null for missing optional fields', () => {
    const raw = buildRaw({ id: 2, full_name: 'Starship' })

    const result = mapRawRocket(raw)

    expect(result.description).toBeNull()
    expect(result.imageUrl).toBeNull()
    expect(result.launchCost).toBeNull()
    expect(result.countryCode).toBeNull()
    expect(result.maidenFlight).toBeNull()
    expect(result.isLocal).toBe(false)
  })

  it('handles launch_cost given as a numeric string', () => {
    const raw = buildRaw({ id: 3, full_name: 'Falcon Heavy', launch_cost: '90000000' })

    const result = mapRawRocket(raw)

    expect(result.launchCost).toBe(90000000)
  })

  it('falls back to null when launch_cost is not a valid number', () => {
    const raw = buildRaw({ id: 4, full_name: 'Unknown Rocket', launch_cost: 'n/a' })

    const result = mapRawRocket(raw)

    expect(result.launchCost).toBeNull()
  })

  it('handles a missing manufacturer object entirely (undefined)', () => {
    const raw = buildRaw({ id: 5, full_name: 'No Manufacturer', manufacturer: undefined })

    const result = mapRawRocket(raw)

    expect(result.countryCode).toBeNull()
  })

  it('keeps countryCode null when manufacturer is present but country_code itself is null', () => {
    const raw = buildRaw({ id: 6, full_name: 'Partial Manufacturer', manufacturer: { country_code: null } })

    const result = mapRawRocket(raw)

    expect(result.countryCode).toBeNull()
  })

  it('preserves a launch cost of 0 instead of treating it as missing', () => {
    const raw = buildRaw({ id: 7, full_name: 'Free Launch', launch_cost: 0 })

    const result = mapRawRocket(raw)

    expect(result.launchCost).toBe(0)
  })

  it('always marks a freshly fetched rocket as not local', () => {
    const raw = buildRaw({ id: 8, full_name: 'Fetched Rocket' })

    const result = mapRawRocket(raw)

    expect(result.isLocal).toBe(false)
  })
})

describe('formatCurrency', () => {
  it('formats a positive number as USD', () => {
    expect(formatCurrency(62000000)).toBe('$62,000,000')
  })

  it('formats zero as a real currency value, not a fallback', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('falls back to "Not available" for null', () => {
    expect(formatCurrency(null)).toBe('Not available')
  })

  it('falls back to "Not available" for NaN', () => {
    expect(formatCurrency(Number.NaN)).toBe('Not available')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    expect(formatDate('2010-06-04')).toBe('June 4, 2010')
  })

  it('falls back to "Not available" for null', () => {
    expect(formatDate(null)).toBe('Not available')
  })

  it('falls back to "Not available" for an empty string', () => {
    expect(formatDate('')).toBe('Not available')
  })

  it('falls back to "Not available" for an unparseable string', () => {
    expect(formatDate('not-a-date')).toBe('Not available')
  })
})

describe('formatCountry', () => {
  it('returns flag and name for a known country code', () => {
    expect(formatCountry('USA')).toBe('🇺🇸 United States')
  })

  it('is case-insensitive on the country code', () => {
    expect(formatCountry('usa')).toBe('🇺🇸 United States')
  })

  it('returns the raw code when the country is unrecognized', () => {
    expect(formatCountry('XYZ')).toBe('XYZ')
  })

  it('falls back to "Not available" for null', () => {
    expect(formatCountry(null)).toBe('Not available')
  })
})