/**
 * utils/parsers.ts
 *
 * Turn raw API or form values into clean values, using `null` for "missing".
 */

/** Trims a string and returns `null` when nothing is left. */
export function cleanText (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Parses a non-negative number (the API sends launch cost as a string, e.g. "7000000"). */
export function parseCost (value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const cost = Number(value)
  return Number.isFinite(cost) && cost >= 0 ? cost : null
}

/** Parses a date string, returning `null` instead of an invalid Date. */
export function parseDate (value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isHttpUrl (value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}
