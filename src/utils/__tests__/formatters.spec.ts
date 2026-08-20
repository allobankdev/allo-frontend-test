import { describe, it, expect } from 'vitest'
import { formatText, formatDescription, formatCurrency, formatDate } from '@/utils/formatters'

describe('formatText', () => {
  it('returns the value as a string when non-empty', () => {
    expect(formatText('USA')).toBe('USA')
  })

  it('returns fallback for null', () => {
    expect(formatText(null)).toBe('Not available')
  })

  it('returns fallback for undefined', () => {
    expect(formatText(undefined)).toBe('Not available')
  })

  it('returns fallback for empty string', () => {
    expect(formatText('')).toBe('Not available')
  })

  it('returns fallback for whitespace-only string', () => {
    expect(formatText('   ')).toBe('Not available')
  })

  it('accepts a custom fallback string', () => {
    expect(formatText(null, 'N/A')).toBe('N/A')
  })

  it('converts numeric values to strings', () => {
    expect(formatText(42)).toBe('42')
  })
})

describe('formatDescription', () => {
  it('returns value when present', () => {
    expect(formatDescription('Powerful rocket')).toBe('Powerful rocket')
  })

  it('returns "Description not available" for null', () => {
    expect(formatDescription(null)).toBe('Description not available')
  })

  it('returns "Description not available" for empty string', () => {
    expect(formatDescription('')).toBe('Description not available')
  })
})

describe('formatCurrency', () => {
  it('formats a numeric string as USD currency', () => {
    expect(formatCurrency('62000000')).toBe('$62,000,000')
  })

  it('formats a number directly', () => {
    expect(formatCurrency(100000)).toBe('$100,000')
  })

  it('returns fallback for null', () => {
    expect(formatCurrency(null)).toBe('Not available')
  })

  it('returns fallback for undefined', () => {
    expect(formatCurrency(undefined)).toBe('Not available')
  })

  it('returns fallback for empty string', () => {
    expect(formatCurrency('')).toBe('Not available')
  })

  it('returns fallback for non-numeric string', () => {
    expect(formatCurrency('abc')).toBe('Not available')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
})

describe('formatDate', () => {
  it('formats a valid YYYY-MM-DD string', () => {
    expect(formatDate('2018-05-11')).toBe('May 11, 2018')
  })

  it('returns fallback for null', () => {
    expect(formatDate(null)).toBe('Not available')
  })

  it('returns fallback for undefined', () => {
    expect(formatDate(undefined)).toBe('Not available')
  })

  it('returns fallback for empty string', () => {
    expect(formatDate('')).toBe('Not available')
  })

  it('returns fallback for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('Not available')
  })

  it('returns fallback for partially invalid date', () => {
    expect(formatDate('2020-99-99')).toBe('Not available')
  })
})
