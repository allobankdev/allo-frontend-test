import { describe, expect, it } from 'vitest'
import { formatCountry, formatLaunchCost, formatMaidenFlight, NOT_AVAILABLE } from '../format'

describe('formatLaunchCost', () => {
  it('memformat biaya dalam USD tanpa desimal', () => {
    expect(formatLaunchCost(52000000)).toBe('US$52.000.000')
  })

  it('memberi fallback jika biaya null', () => {
    expect(formatLaunchCost(null)).toBe(NOT_AVAILABLE)
  })
})

describe('formatMaidenFlight', () => {
  it('memformat tanggal dalam bahasa Indonesia', () => {
    expect(formatMaidenFlight('2018-05-11')).toBe('11 Mei 2018')
  })

  it('memberi fallback jika tanggal null atau tidak valid', () => {
    expect(formatMaidenFlight(null)).toBe(NOT_AVAILABLE)
    expect(formatMaidenFlight('bukan-tanggal')).toBe(NOT_AVAILABLE)
  })
})

describe('formatCountry', () => {
  it('menampilkan kode negara atau fallback', () => {
    expect(formatCountry('USA')).toBe('USA')
    expect(formatCountry(null)).toBe(NOT_AVAILABLE)
  })
})
