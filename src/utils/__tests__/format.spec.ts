import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatCurrency, formatDate } from '../format'

describe('formatCurrency', () => {
  it('formats a positive number as a rounded USD amount', () => {
    expect(formatCurrency(7_000_000)).toBe('$7,000,000')
  })

  it('returns null for null input, not "$NaN"', () => {
    expect(formatCurrency(null)).toBeNull()
  })
})

describe('formatDate', () => {
  it('formats a valid ISO calendar date in Indonesian long form', () => {
    expect(formatDate('2018-02-06')).toBe('6 Februari 2018')
  })

  it('returns null for null input', () => {
    expect(formatDate(null)).toBeNull()
  })

  describe('across host timezones', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    // Regression test for a real bug: an earlier implementation used `new Date(value)` and
    // let Intl.DateTimeFormat fall back to the host's local timezone. That combination reads
    // a date-only string as UTC midnight, then renders it one day earlier for any viewer
    // behind UTC. formatDate() now pins both the Date construction and the formatter to UTC,
    // so the result must stay "24" no matter which timezone actually runs this test.
    for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Bangkok', 'Pacific/Kiritimati']) {
      it(`stays on the 24th when TZ=${zone}`, () => {
        vi.stubEnv('TZ', zone)
        const result = formatDate('2006-03-24')
        expect(result).toContain('24')
        expect(result).not.toContain('23')
      })
    }
  })
})
