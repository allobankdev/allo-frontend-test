export function formatNumber(value: number | string): string {
  if (value === null || value === undefined || value === '') return '-'

  const number = Number(value)
  if (isNaN(number)) return '-'

  return new Intl.NumberFormat('id-ID').format(number)
}

export function formatDate(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date)
}
