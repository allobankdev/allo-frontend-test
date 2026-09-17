import type { Rocket } from '@/types/rocket'

export const FALLBACK_TEXT = 'N/A'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function getRocketName (rocket: Rocket): string {
  return rocket.full_name?.trim() || rocket.name?.trim() || 'Unnamed rocket'
}

export function getRocketDescription (rocket: Rocket): string {
  return rocket.description?.trim() || 'No description available.'
}

export function formatCost (value: string | null | undefined): string {
  if (!value) return FALLBACK_TEXT
  const amount = Number(value)
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : FALLBACK_TEXT
}

export function formatDate (value: string | null | undefined): string {
  if (!value) return FALLBACK_TEXT
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? FALLBACK_TEXT : dateFormatter.format(date)
}

export function getErrorMessage (error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}
