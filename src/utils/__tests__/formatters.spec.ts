import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, normalizeRocket, truncateText } from '../formatters'
import type { LauncherConfigApi } from '@/types/rocket'
import { DEFAULT_MANUFACTURER_COUNTRY, DEFAULT_ROCKET_IMAGE } from '../constants'

describe('formatCurrency', () => {
  it('formats numeric values as USD currency', () => {
    expect(formatCurrency(67000000)).toBe('$67,000,000')
    expect(formatCurrency(50000000)).toBe('$50,000,000')
  })

  it('formats numeric strings correctly', () => {
    expect(formatCurrency('90000000')).toBe('$90,000,000')
  })

  it('returns fallback string for null, undefined, empty, or non-positive values', () => {
    expect(formatCurrency(null)).toBe('Undisclosed / N/A')
    expect(formatCurrency(undefined)).toBe('Undisclosed / N/A')
    expect(formatCurrency('')).toBe('Undisclosed / N/A')
    expect(formatCurrency(0)).toBe('Undisclosed / N/A')
    expect(formatCurrency(-500)).toBe('Undisclosed / N/A')
  })
})

describe('formatDate', () => {
  it('formats valid ISO date strings to readable month day year', () => {
    expect(formatDate('2006-03-24')).toBe('Mar 24, 2006')
    expect(formatDate('2020-05-30')).toBe('May 30, 2020')
  })

  it('returns fallback for null, undefined, or empty date strings', () => {
    expect(formatDate(null)).toBe('Not recorded / N/A')
    expect(formatDate(undefined)).toBe('Not recorded / N/A')
    expect(formatDate('')).toBe('Not recorded / N/A')
  })

  it('returns original string if date is not parseable', () => {
    expect(formatDate('TBD')).toBe('TBD')
  })
})

describe('truncateText', () => {
  it('returns original text if shorter than max length', () => {
    const text = 'Short description.'
    expect(truncateText(text, 50)).toBe(text)
  })

  it('truncates and appends ellipsis when longer than max length', () => {
    const text = 'This is a long description about SpaceX Falcon 9 rocket and its reusable booster capabilities.'
    const truncated = truncateText(text, 25)
    expect(truncated).toBe('This is a long descriptio...')
    expect(truncated.length).toBeLessThanOrEqual(28)
  })

  it('returns fallback text for null or empty string', () => {
    expect(truncateText(null)).toBe('No description available for this rocket.')
    expect(truncateText('')).toBe('No description available for this rocket.')
  })
})

describe('normalizeRocket', () => {
  it('correctly maps raw API structure to normalized Rocket model', () => {
    const rawApi: LauncherConfigApi = {
      id: 10,
      name: 'Falcon 9',
      full_name: 'Falcon 9 Block 5',
      description: 'Two-stage orbital launch vehicle',
      launch_cost: 67000000,
      maiden_flight: '2010-06-04',
      image_url: 'https://example.com/falcon9.jpg',
      family: 'Falcon',
      active: true,
      reusable: true,
      manufacturer: {
        id: 121,
        name: 'SpaceX',
        country_code: 'USA',
      },
    }

    const normalized = normalizeRocket(rawApi)
    expect(normalized).toEqual({
      id: 10,
      name: 'Falcon 9',
      fullName: 'Falcon 9 Block 5',
      description: 'Two-stage orbital launch vehicle',
      launchCost: 67000000,
      countryCode: 'USA',
      maidenFlight: '2010-06-04',
      imageUrl: 'https://example.com/falcon9.jpg',
      family: 'Falcon',
      active: true,
      reusable: true,
      isCustom: false,
    })
  })

  it('provides safe fallbacks for missing raw API fields', () => {
    const rawApi: LauncherConfigApi = {
      id: 99,
      name: 'Experimental Rocket',
      full_name: '',
      description: null,
      launch_cost: null,
      maiden_flight: null,
      image_url: null,
      family: null,
      active: null,
      reusable: null,
      manufacturer: null,
    }

    const normalized = normalizeRocket(rawApi)
    expect(normalized.fullName).toBe('Experimental Rocket')
    expect(normalized.description).toBeNull()
    expect(normalized.imageUrl).toBe(DEFAULT_ROCKET_IMAGE)
    expect(normalized.countryCode).toBe(DEFAULT_MANUFACTURER_COUNTRY)
    expect(normalized.active).toBe(false)
    expect(normalized.reusable).toBe(false)
    expect(normalized.isCustom).toBe(false)
  })
})
