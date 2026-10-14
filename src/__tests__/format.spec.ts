import { describe, expect, it } from 'vitest'
import {
  MISSING_COST_LABEL,
  MISSING_DATE_LABEL,
  MISSING_DESCRIPTION_LABEL,
  countryLabel,
  familyLabel,
  formatDescription,
  formatLaunchCost,
  formatMaidenFlight,
  isMissing,
} from '@/utils/format'

describe('format utils', () => {
  it('formats a numeric launch cost as USD', () => {
    expect(formatLaunchCost('52000000')).toBe('$52,000,000')
  })

  it('falls back for null/empty launch cost (e.g. Starship)', () => {
    expect(formatLaunchCost(null)).toBe(MISSING_COST_LABEL)
    expect(formatLaunchCost(undefined)).toBe(MISSING_COST_LABEL)
    expect(formatLaunchCost('')).toBe(MISSING_COST_LABEL)
    expect(formatLaunchCost('0')).toBe(MISSING_COST_LABEL)
  })

  it('formats a valid maiden flight date', () => {
    expect(formatMaidenFlight('2018-05-11')).toContain('2018')
  })

  it('falls back for null/invalid maiden flight (e.g. id 528)', () => {
    expect(formatMaidenFlight(null)).toBe(MISSING_DATE_LABEL)
    expect(formatMaidenFlight('')).toBe(MISSING_DATE_LABEL)
    expect(formatMaidenFlight('not-a-date')).toBe(MISSING_DATE_LABEL)
  })

  it('falls back for missing descriptions', () => {
    expect(formatDescription(null)).toBe(MISSING_DESCRIPTION_LABEL)
    expect(formatDescription('  ')).toBe(MISSING_DESCRIPTION_LABEL)
    expect(formatDescription('Falcon 1')).toBe('Falcon 1')
  })

  it('labels missing country/family with an em dash', () => {
    expect(countryLabel(null)).toBe('—')
    expect(familyLabel(undefined)).toBe('—')
    expect(countryLabel('USA')).toBe('USA')
  })

  it('detects missing values', () => {
    expect(isMissing(null)).toBe(true)
    expect(isMissing('   ')).toBe(true)
    expect(isMissing('x')).toBe(false)
    expect(isMissing(0)).toBe(false)
  })
})
