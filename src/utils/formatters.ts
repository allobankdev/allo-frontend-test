// ============================================================
// Utility / Formatter Functions
// ============================================================

/**
 * Format a number with thousand separators.
 * Returns '–' for null / undefined values.
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value == null || value === '') return '–'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '–'
  return num.toLocaleString('id-ID')
}

/**
 * Format launch cost (stored as string in 2.2.0 API).
 * e.g. "62000000" → "US$62.000.000"
 */
export function formatCost(cost: string | null | undefined): string {
  if (!cost || cost.trim() === '') return '–'
  const num = parseFloat(cost)
  if (isNaN(num)) return '–'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format a mass value in kilograms.
 */
export function formatMass(kg: number | string | null | undefined): string {
  if (kg == null || kg === '') return '–'
  const num = typeof kg === 'string' ? parseFloat(kg) : kg
  if (isNaN(num)) return '–'
  return `${num.toLocaleString('id-ID')} kg`
}

/**
 * Format a length / diameter in metres.
 */
export function formatLength(metres: number | null | undefined): string {
  if (metres == null) return '–'
  return `${metres.toFixed(1)} m`
}

/**
 * Format thrust value in kilo-newtons.
 */
export function formatThrust(kn: number | null | undefined): string {
  if (kn == null) return '–'
  return `${kn.toLocaleString('id-ID')} kN`
}

/**
 * Format an ISO date string to a human-readable date.
 * e.g. "2010-06-04" → "4 Juni 2010"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '–'
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Calculate a success rate percentage.
 */
export function formatSuccessRate(successful: number, total: number): string {
  if (total === 0) return '–'
  return `${((successful / total) * 100).toFixed(1)}%`
}

/**
 * Truncate text to maxLength, appending '…' if truncated.
 */
export function truncate(text: string | null | undefined, maxLength = 120): string {
  if (!text) return '–'
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
