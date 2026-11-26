/**
 * utils/validation.ts
 *
 * Vuetify-style form rules: each returns `true` or an error message.
 */

type Rule = (value: unknown) => true | string

const isBlank = (value: unknown) => value === null || value === undefined || String(value).trim() === ''

export const required = (label: string): Rule =>
  value => !isBlank(value) || `${label} is required`

export const maxLength = (max: number): Rule =>
  value => isBlank(value) || String(value).trim().length <= max || `Maximum ${max} characters`

export const optionalUrl: Rule = value => {
  if (isBlank(value)) return true
  try {
    const url = new URL(String(value).trim())
    return ['http:', 'https:'].includes(url.protocol) || 'Must be an http(s) URL'
  } catch {
    return 'Must be a valid URL'
  }
}

export const optionalNonNegativeNumber: Rule = value =>
  isBlank(value) || (Number.isFinite(Number(value)) && Number(value) >= 0) || 'Must be a positive number'

export const optionalCountryCode: Rule = value =>
  isBlank(value) || /^[A-Za-z]{3}$/.test(String(value).trim()) || 'Use a 3-letter code, e.g. USA'
