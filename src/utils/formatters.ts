/** Format launch_cost (string) ke mata uang; kembalikan 'N/A' jika null. */
export function formatCurrency(value: string | null): string {
  if (!value) return 'N/A'

  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 'N/A'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numeric)
}

/** Format maiden_flight (ISO date string) ke format tanggal; kembalikan 'N/A' jika null. */
export function formatDate(value: string | null): string {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'

  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

/** Fallback teks untuk field deskripsi yang null/kosong. */
export function fallbackText(value: string | null, fallback = 'N/A'): string {
  return value && value.trim().length > 0 ? value : fallback
}

/** Kode negara (2 huruf) jadi nama negara; kembalikan 'N/A' jika null. */
export function formatCountry(countryCode: string | null): string {
  if (!countryCode) return 'N/A'

  const display = new Intl.DisplayNames(['en'], { type: 'region' })
  try {
    return display.of(countryCode.toUpperCase()) ?? 'N/A'
  } catch {
    return countryCode.toUpperCase()
  }
}

/** Konversi kode negara ISO 2 huruf ke flag emoji; kosong jika bukan 2 huruf. */
export function countryFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return ''

  const regionalOffset = 0x1f1e6 - 'A'.charCodeAt(0)
  const upper = countryCode.toUpperCase()

  return String.fromCodePoint(
    ...Array.from(upper).map((ch) => regionalOffset + ch.charCodeAt(0)),
  )
}
