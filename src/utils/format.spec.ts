import { describe, expect, it } from 'vitest'
import { formatCost, formatDate, UNAVAILABLE_TEXT } from '@/utils/format'

describe('formatCost', () => {
  it('formats a USD amount', () => {
    expect(formatCost(7000000)).toBe('$7,000,000')
  })

  it('shows the fallback text when the cost is missing', () => {
    expect(formatCost(null)).toBe(UNAVAILABLE_TEXT)
  })

  it('keeps zero as a real value instead of falling back', () => {
    expect(formatCost(0)).toBe('$0')
  })
})

describe('formatDate', () => {
  it('formats a date-only value without shifting the day', () => {
    // A timezone shift would turn 2006-03-24 into the 23rd.
    expect(formatDate('2006-03-24')).toContain('24')
  })

  it('shows the fallback text when the date is missing', () => {
    expect(formatDate(null)).toBe(UNAVAILABLE_TEXT)
  })

  it('returns the raw value when it cannot be parsed', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
