export function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function rocketName(rocket: { full_name?: string | null, name?: string }): string {
  return rocket.full_name?.trim() || rocket.name?.trim() || 'Data tidak tersedia.'
}

export function rocketDescription(rocket: { description?: string | null }): string {
  return rocket.description?.trim() || 'Data tidak tersedia.'
}

export function formatLaunchCost(value: string | null | undefined): string {
  return value?.trim() || 'Data tidak tersedia.'
}

export function formatFirstFlight(value: string | null | undefined): string {
  const text = value?.trim()

  if (!text || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return 'Data tidak tersedia.'
  }

  const date = new Date(text)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) return 'Data tidak tersedia.'

  return text
}
