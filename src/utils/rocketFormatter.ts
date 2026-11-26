import type { RocketManufacturer } from '@/types/rocket'

const DEFAULT_FALLBACK_TEXT = 'Not available'
const DEFAULT_DESCRIPTION_FALLBACK = 'No description available for this rocket.'

/**
 * Self-contained inline SVG placeholder used when `image_url` is missing or invalid,
 * avoiding broken external requests or fake image URLs.
 */
const ROCKET_IMAGE_PLACEHOLDER_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="No rocket image available">',
  '<rect width="640" height="360" fill="#1e2430"/>',
  '<g fill="none" stroke="#64748b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">',
  '<path d="M320 90c42 40 58 94 58 148h-116c0-54 16-108 58-148Z"/>',
  '<circle cx="320" cy="176" r="18"/>',
  '<path d="M262 212l-30 32h34M378 212l30 32h-34M294 238l26 32 26-32"/>',
  '</g>',
  '<text x="320" y="316" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="18">Image Not Available</text>',
  '</svg>',
].join('')

const ROCKET_IMAGE_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(ROCKET_IMAGE_PLACEHOLDER_SVG)}`

const usdCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

function getTrimmedOrNull(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function getTextOrFallback(
  value: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK_TEXT,
): string {
  return getTrimmedOrNull(value) ?? fallback
}

function isSafeImageSource(value: string): boolean {
  if (value.startsWith('data:image/') || value.startsWith('/')) {
    return true
  }

  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Formats a rocket name with a safe fallback when missing.
 */
export function formatRocketName(fullName?: string | null): string {
  return getTextOrFallback(fullName, 'Unnamed Rocket')
}

/**
 * Formats launch cost into USD currency or returns "Not available" when empty/invalid.
 */
export function formatLaunchCost(launchCost?: string | number | null): string {
  if (launchCost === null || launchCost === undefined) {
    return DEFAULT_FALLBACK_TEXT
  }

  const numericValue = typeof launchCost === 'number'
    ? launchCost
    : Number(getTrimmedOrNull(launchCost) ?? Number.NaN)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return DEFAULT_FALLBACK_TEXT
  }

  return usdCurrencyFormatter.format(numericValue)
}

/**
 * Formats maiden flight date (`YYYY-MM-DD`) in UTC to avoid local timezone date shifts.
 */
export function formatFirstFlight(maidenFlight?: string | null): string {
  const rawDate = getTrimmedOrNull(maidenFlight)
  if (!rawDate) {
    return DEFAULT_FALLBACK_TEXT
  }

  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate)
  if (isoDateMatch) {
    const year = Number(isoDateMatch[1])
    const month = Number(isoDateMatch[2])
    const day = Number(isoDateMatch[3])
    const utcDate = new Date(Date.UTC(year, month - 1, day))

    if (
      utcDate.getUTCFullYear() === year
      && utcDate.getUTCMonth() === month - 1
      && utcDate.getUTCDate() === day
    ) {
      return dateFormatter.format(utcDate)
    }

    return rawDate
  }

  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) {
    return rawDate
  }

  return dateFormatter.format(parsed)
}

/**
 * Extracts and formats `manufacturer.country_code`, falling back to "Not available".
 */
export function formatCountry(manufacturer?: RocketManufacturer | null): string {
  return getTextOrFallback(manufacturer?.country_code)
}

/**
 * Formats rocket description with an informative fallback message.
 */
export function formatDescription(description?: string | null): string {
  return getTextOrFallback(description, DEFAULT_DESCRIPTION_FALLBACK)
}

/**
 * Returns a valid rocket image URL or an inline SVG placeholder when missing/invalid.
 */
export function getRocketImage(imageUrl?: string | null): string {
  const trimmed = getTrimmedOrNull(imageUrl)
  if (!trimmed || !isSafeImageSource(trimmed)) {
    return ROCKET_IMAGE_FALLBACK
  }

  return trimmed
}
