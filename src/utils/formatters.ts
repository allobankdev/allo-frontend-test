/**
 * Formatting utilities for rocket data with fallback for missing values.
 */

export const PLACEHOLDER_ROCKET_IMAGE = 'https://images.unsplash.com/photo-1517976487507-5b3b488354c4?auto=format&fit=crop&w=800&q=80'

export function formatCurrency(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return 'Unknown / Not disclosed'
  }
  const numeric = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  if (Number.isNaN(numeric)) {
    return String(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'Not recorded / TBD'
  }
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function formatCountry(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.trim() === '') {
    return 'N/A'
  }
  return countryCode.toUpperCase()
}

export function getSafeImage(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return PLACEHOLDER_ROCKET_IMAGE
  }
  return imageUrl
}
