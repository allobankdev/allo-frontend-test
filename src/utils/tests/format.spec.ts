import { formatCost, formatCountry, formatFirstFlight } from '@/utils/format'
import { parseNullableNumber } from '@/utils/number'
import { describe, expect, it } from 'vitest'

describe('formatCost', () => {
    it('formats a number as whole US dollars', () => {
        expect(formatCost(52_000_000)).toBe('$52,000,000')
    })

    it('falls back to "Not disclosed" when the value is missing', () => {
        expect(formatCost(null)).toBe('Not disclosed')
    })
})

describe('formatCountry', () => {
    it('returns the country code as-is', () => {
        expect(formatCountry('USA')).toBe('USA')
    })

    it('falls back to "Unknown" when the value is missing', () => {
        expect(formatCountry(null)).toBe('Unknown')
    })
})

describe('formatFirstFlight', () => {
    it('formats an ISO date for humans', () => {
        expect(formatFirstFlight('2018-05-11')).toBe('11 May 2018')
    })

    it('falls back to "Not flown yet" when the value is missing', () => {
        expect(formatFirstFlight(null)).toBe('Not flown yet')
    })

    it('handles an unparsable date', () => {
        expect(formatFirstFlight('not-a-date')).toBe('Unknown')
    })
})

describe('parseNullableNumber', () => {
    it('parses numeric strings coming from the API', () => {
        expect(parseNullableNumber('52000000')).toBe(52_000_000)
    })

    it('treats empty and invalid values as null', () => {
        expect(parseNullableNumber(null)).toBeNull()
        expect(parseNullableNumber('')).toBeNull()
        expect(parseNullableNumber('negotiable')).toBeNull()
    })
})
