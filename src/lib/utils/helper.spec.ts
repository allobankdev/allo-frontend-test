import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatNumber } from './helper'

describe('formatCurrency', () => {
  it('formats a positive amount compactly by default', () => {
    expect(formatCurrency(7_000_000)).toBe('$7M')
  })

  it('formats a positive amount in full when compact is false', () => {
    expect(formatCurrency(7_000_000, false)).toBe('$7,000,000')
  })

  it('accepts a numeric string', () => {
    expect(formatCurrency('7000000')).toBe('$7M')
  })

  it('returns null for null', () => {
    expect(formatCurrency(null)).toBeNull()
  })

  it('returns null for zero', () => {
    expect(formatCurrency(0)).toBeNull()
  })
})

describe('formatNumber', () => {
  it('formats a plain number with thousands separators', () => {
    expect(formatNumber(1234)).toBe('1,234')
  })

  it('appends a unit when provided', () => {
    expect(formatNumber(9, 'm')).toBe('9 m')
  })

  it('keeps zero as a valid value', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('returns null for null', () => {
    expect(formatNumber(null)).toBeNull()
  })

  it('returns null for a non-numeric string', () => {
    expect(formatNumber('N/A')).toBeNull()
  })
})

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    expect(formatDate('2006-03-24')).toBe('Mar 24, 2006')
  })

  it('returns null for null', () => {
    expect(formatDate(null)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(formatDate('')).toBeNull()
  })
})
