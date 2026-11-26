import type { ApiRocket, Rocket } from '@/types/rocket'

export function mapApiRocket (apiRocket: ApiRocket): Rocket {
  return {
    id: String(apiRocket.id),
    name: toText(apiRocket.full_name) ?? toText(apiRocket.name) ?? "Unnamed Rocket",
    description: toText(apiRocket.description),
    imageUrl: toText(apiRocket.image_url),
    launchCost: toPositiveNumber(apiRocket.launch_cost),
    countryCode: toText(apiRocket.manufacturer?.country_code),
    firstFlight: toIsoDate(apiRocket.maiden_flight),
    active: typeof apiRocket.active === 'boolean' ? apiRocket.active : null,
    isCustom: false,
  }
}

/** Trims text; empty or missing → null. */
function toText (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** "50000000" → 50000000; missing, invalid or ≤ 0 → null. */
function toPositiveNumber (value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

/** Keeps a parseable date string; anything else → null. */
function toIsoDate (value: string | null | undefined): string | null {
  const text = toText(value)
  if (!text || Number.isNaN(Date.parse(text))) return null
  return text
}

