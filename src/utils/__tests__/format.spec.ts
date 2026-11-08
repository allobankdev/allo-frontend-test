import { describe, expect, it } from 'vitest'
import { formatCountries, formatCurrency, formatDate, formatQuantity, formatYear } from '@/utils/format'

describe('format', () => {
  it('formats currency in full and compact form', () => {
    expect(formatCurrency(52_000_000)).toBe('$52,000,000')
    expect(formatCurrency(52_000_000, { compact: true })).toBe('$52M')
    expect(formatCurrency(null)).toBeNull()
  })

  it('formats ISO dates without timezone shifts', () => {
    expect(formatDate('2006-03-24')).toBe('March 24, 2006')
    expect(formatDate('2018-01-01')).toBe('January 1, 2018')
    expect(formatDate(null)).toBeNull()
  })

  it('extracts the year', () => {
    expect(formatYear('2018-02-06')).toBe('2018')
    expect(formatYear(null)).toBeNull()
  })

  it('maps alpha-3 country codes to names and keeps unknown codes', () => {
    expect(formatCountries(['USA'])).toBe('United States')
    expect(formatCountries(['FRA', 'XYZ'])).toBe('France, XYZ')
    expect(formatCountries([])).toBeNull()
  })

  it('formats quantities with units', () => {
    expect(formatQuantity(1420.5, 't')).toBe('1,420.5 t')
    expect(formatQuantity(null, 'kg')).toBeNull()
  })
})
