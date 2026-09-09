export function formatCurrency (value: number | null): string | null {
  if (value === null) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate (value: string | null): string | null {
  if (!value) return null

  // maiden_flight is a calendar date only ("2006-03-24"), not a specific moment in time —
  // it should read the same regardless of which timezone the viewer (or this code) runs in.
  // Both the Date construction and the formatter are pinned to UTC on purpose: `new Date(value)`
  // alone would parse the string as UTC midnight but then format in the *local* timezone by
  // default, which silently shifts the day back by one for viewers behind UTC (e.g. US Pacific).
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  const date = new Date(Date.UTC(year, month - 1, day))
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}
