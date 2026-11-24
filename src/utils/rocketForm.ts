import type { NewRocketInput } from '@/types/rocket'

export interface RocketFormValues {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  maidenFlight: string
}

export function createEmptyForm (): RocketFormValues {
  return {
    name: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    country: '',
    maidenFlight: '',
  }
}

function toTrimmed (value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateName (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (!trimmed) {
    return 'Rocket name is required.'
  }
  if (trimmed.length > 100) {
    return 'Name must be at most 100 characters.'
  }
  return true
}

export function validateDescription (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (trimmed.length > 1000) {
    return 'Description must be at most 1000 characters.'
  }
  return true
}

export function validateImageUrl (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (!trimmed) {
    return true
  }
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'Enter a valid http(s) URL.'
    }
    return true
  } catch {
    return 'Enter a valid http(s) URL.'
  }
}

export function validateLaunchCost (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (!trimmed) {
    return true
  }
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return 'Enter a non-negative amount in USD, e.g. 50000000.'
  }
  const numeric = Number(trimmed)
  if (!Number.isFinite(numeric)) {
    return 'Enter a non-negative amount in USD, e.g. 50000000.'
  }
  return true
}

export function validateCountry (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (trimmed.length > 56) {
    return 'Country must be at most 56 characters.'
  }
  return true
}

export function validateMaidenFlight (value: string | null | undefined): true | string {
  const trimmed = toTrimmed(value)
  if (!trimmed) {
    return true
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) {
    return 'Enter a valid date.'
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return 'Enter a valid date.'
  }
  return true
}

function toNullableString (value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function buildNewRocketInput (values: RocketFormValues): NewRocketInput {
  const trimmedCost = values.launchCost.trim()
  const parsedCost = trimmedCost.length > 0 ? Number(trimmedCost) : null

  return {
    name: values.name.trim(),
    description: toNullableString(values.description),
    imageUrl: toNullableString(values.imageUrl),
    launchCost: parsedCost !== null && Number.isFinite(parsedCost) ? parsedCost : null,
    country: toNullableString(values.country),
    maidenFlight: toNullableString(values.maidenFlight),
  }
}
