/**
 * The only module that knows Launch Library field names.
 * Converts API DTOs into the null-safe `Rocket` domain model.
 */

import type { LauncherConfigDto } from '@/types/api'
import type { NewRocketInput, Rocket } from '@/types/rocket'

export const LOCAL_ID_PREFIX = 'local-'

export function mapLauncherToRocket (dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: toText(dto.full_name) ?? toText(dto.name) ?? 'Unnamed rocket',
    family: toText(dto.family),
    description: toText(dto.description),
    imageUrl: toHttpUrl(dto.image_url),
    launchCost: toNumber(dto.launch_cost),
    countryCodes: toCountryCodes(dto.manufacturer?.country_code),
    firstFlight: toIsoDate(dto.maiden_flight),
    manufacturer: toText(dto.manufacturer?.name),
    isActive: dto.active ?? null,
    isReusable: dto.reusable ?? null,
    specs: {
      heightMeters: toNumber(dto.length),
      diameterMeters: toNumber(dto.diameter),
      massTonnes: toNumber(dto.launch_mass),
      leoCapacityKg: toNumber(dto.leo_capacity),
      gtoCapacityKg: toNumber(dto.gto_capacity),
      thrustKilonewtons: toNumber(dto.to_thrust),
    },
    launches: {
      total: toNumber(dto.total_launch_count),
      successful: toNumber(dto.successful_launches),
      failed: toNumber(dto.failed_launches),
    },
    wikiUrl: toHttpUrl(dto.wiki_url),
    source: 'api',
  }
}

let localSequence = 0

/** Builds a user-added rocket. It goes through the same null-safe shape as API rockets. */
export function createLocalRocket (input: NewRocketInput, now = Date.now()): Rocket {
  localSequence += 1
  return {
    id: `${LOCAL_ID_PREFIX}${now.toString(36)}-${localSequence}`,
    name: toText(input.name) ?? 'Unnamed rocket',
    family: null,
    description: toText(input.description),
    imageUrl: toHttpUrl(input.imageUrl),
    launchCost: toNumber(input.launchCost),
    countryCodes: toCountryCodes(input.countryCode),
    firstFlight: toIsoDate(input.firstFlight),
    manufacturer: null,
    isActive: input.isActive,
    isReusable: input.isReusable,
    specs: {
      heightMeters: null,
      diameterMeters: null,
      massTonnes: null,
      leoCapacityKg: null,
      gtoCapacityKg: null,
      thrustKilonewtons: null,
    },
    launches: { total: null, successful: null, failed: null },
    wikiUrl: null,
    source: 'local',
  }
}

export function isLocalRocketId (id: string): boolean {
  return id.startsWith(LOCAL_ID_PREFIX)
}

// ── Normalizers ────────────────────────────────────────────────────────────

function toText (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function toNumber (value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toHttpUrl (value: string | null | undefined): string | null {
  const text = toText(value)
  return text && /^https?:\/\//i.test(text) ? text : null
}

function toIsoDate (value: string | null | undefined): string | null {
  const text = toText(value)
  return text && /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null
}

function toCountryCodes (value: string | null | undefined): string[] {
  return (toText(value) ?? '')
    .split(',')
    .map(code => code.trim().toUpperCase())
    .filter(Boolean)
}
