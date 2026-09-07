export function textOrFallback(
  value: string | null | undefined,
  fallback = 'Not available',
) {
  if (!value?.trim()) {
    return fallback
  }

  return value
}


export function formatLaunchCost(
  value:
    | number
    | string
    | null
    | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Not available'
  }

  const numericValue =
    Number(value)

  if (
    Number.isNaN(numericValue)
  ) {
    return String(value)
  }

  return new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    },
  ).format(numericValue)
}


export function formatDate(
  value:
    | string
    | null
    | undefined,
) {
  if (!value) {
    return 'Not available'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(date.getTime())
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date)
}