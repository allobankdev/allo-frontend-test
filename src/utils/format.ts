const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // API dates are calendar dates; format in UTC so they don't shift a day.
  timeZone: 'UTC',
})

export function formatCurrency (value: number | null): string | null {
  return value == null ? null : currencyFormatter.format(value)
}

export function formatDate (isoDate: string | null): string | null {
  if (!isoDate) return null
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date)
}
