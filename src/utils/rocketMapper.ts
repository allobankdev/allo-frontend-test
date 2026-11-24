import type { Rocket, RocketApiDto } from '@/types/rocket'

function normalizeString (value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseLaunchCost (value: string | null | undefined): number | null {
  const normalized = normalizeString(value)
  if (normalized === null) {
    return null
  }
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function mapRocketDto (dto: RocketApiDto): Rocket {
  const name =
    normalizeString(dto.full_name) ??
    normalizeString(dto.name) ??
    'Unknown rocket'

  return {
    id: String(dto.id),
    name,
    description: normalizeString(dto.description),
    imageUrl: normalizeString(dto.image_url),
    launchCost: parseLaunchCost(dto.launch_cost),
    country: normalizeString(dto.manufacturer?.country_code),
    maidenFlight: normalizeString(dto.maiden_flight),
    isLocal: false,
  }
}
