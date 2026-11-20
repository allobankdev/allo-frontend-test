export function requiredRule (value: string): true | string {
  return value?.trim() ? true : 'This field is required'
}

export function optionalHttpUrlRule (value: string): true | string {
  const trimmed = value?.trim()
  if (!trimmed) return true

  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? true
      : 'Enter a valid http(s) URL'
  } catch {
    return 'Enter a valid URL'
  }
}

export function optionalNonNegativeNumberRule (value: string): true | string {
  const trimmed = value?.trim()
  if (!trimmed) return true

  const num = Number(trimmed)
  return Number.isFinite(num) && num >= 0 ? true : 'Cost must be 0 or greater'
}
