import { describe, expect, it } from 'vitest'
import { toRocket } from '@/services/rocketService'
import { formatCurrency, formatDate, orFallback } from '@/utils/format'
import type { ApiLauncher } from '@/types/rocket'

describe('format utilities', () => {
  it('orFallback returns fallback when value is empty or null', () => {
    expect(orFallback(null)).toBe('N/A')
    expect(orFallback('')).toBe('N/A')
    expect(orFallback('   ')).toBe('N/A')
    expect(orFallback('USA')).toBe('USA')
  })

  it('formatCurrency formats valid numbers or returns fallback', () => {
    expect(formatCurrency(null)).toBe('N/A')
    expect(formatCurrency(50000000)).toBe('$50,000,000')
  })

  it('formatDate formats valid dates or returns fallback', () => {
    expect(formatDate(null)).toBe('N/A')
    expect(formatDate('invalid-date')).toBe('N/A')
    expect(formatDate('2006-03-24')).toContain('2006')
  })
})

describe('rocket mapper', () => {
  it('maps raw API launcher object properly and handles missing fields', () => {
    const raw: ApiLauncher = {
      id: 123,
      full_name: 'Falcon 9 Block 5',
      description: 'Two-stage rocket',
      image_url: 'https://example.com/falcon.jpg',
      launch_cost: '50000000',
      manufacturer: { country_code: 'USA' },
      maiden_flight: '2010-06-04',
    }

    const result = toRocket(raw)

    expect(result.id).toBe('123')
    expect(result.name).toBe('Falcon 9 Block 5')
    expect(result.launchCost).toBe(50000000)
    expect(result.country).toBe('USA')
    expect(result.isLocal).toBe(false)
  })

  it('handles empty optional values with null defaults', () => {
    const raw: ApiLauncher = {
      id: 456,
      name: 'Unknown Rocket',
      full_name: null,
      description: null,
      image_url: null,
      launch_cost: null,
      manufacturer: null,
      maiden_flight: null,
    }

    const result = toRocket(raw)

    expect(result.id).toBe('456')
    expect(result.name).toBe('Unknown Rocket')
    expect(result.description).toBeNull()
    expect(result.imageUrl).toBeNull()
    expect(result.launchCost).toBeNull()
    expect(result.country).toBeNull()
  })
})

