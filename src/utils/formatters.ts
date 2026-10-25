import type { LauncherConfigApi, Rocket } from '@/types/rocket'
import { DEFAULT_MANUFACTURER_COUNTRY, DEFAULT_ROCKET_IMAGE } from './constants'

/**
 * Formats a launch cost value into a human-readable USD currency string.
 * Returns a fallback string if the cost is null, undefined, or invalid.
 */
export function formatCurrency (value?: number | string | null): string {
  if (value === null || value === undefined || value === '') {
    return 'Undisclosed / N/A'
  }

  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value

  if (isNaN(numericValue) || numericValue <= 0) {
    return 'Undisclosed / N/A'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable date.
 * Returns a friendly fallback for missing or invalid dates.
 */
export function formatDate (dateString?: string | null): string {
  if (!dateString) {
    return 'Not recorded / N/A'
  }

  const parsed = new Date(dateString)
  if (isNaN(parsed.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

/**
 * Truncates text to a specified maximum length and appends an ellipsis.
 */
export function truncateText (text?: string | null, maxLength = 120): string {
  if (!text) {
    return 'No description available for this rocket.'
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

/**
 * Transforms raw API launcher data into a normalized Rocket entity.
 */
export function normalizeRocket (apiData: LauncherConfigApi): Rocket {
  return {
    id: apiData.id,
    name: apiData.name || 'Unnamed Rocket',
    fullName: apiData.full_name || apiData.name || 'Unnamed Rocket',
    description: apiData.description?.trim() || null,
    launchCost: apiData.launch_cost,
    countryCode: apiData.manufacturer?.country_code || DEFAULT_MANUFACTURER_COUNTRY,
    maidenFlight: apiData.maiden_flight,
    imageUrl: apiData.image_url || DEFAULT_ROCKET_IMAGE,
    family: apiData.family || null,
    active: Boolean(apiData.active),
    reusable: Boolean(apiData.reusable),
    isCustom: false,
  }
}
