/**
 * services/rocketService.ts
 *
 * Launch Library 2 (v2.2.0) rocket endpoints, mapped to the app's `Rocket` model.
 */

import { fetchJson } from './apiClient'
import type {
  LauncherConfigDto,
  LauncherManufacturerDto,
  PaginatedResponseDto,
  Rocket,
  RocketManufacturer,
  RocketStats,
} from '@/types/rocket'

// `mode=detailed` is required for description/details; `limit=20` returns all 13 rockets in one page.
const LIST_QUERY = new URLSearchParams({
  manufacturer__name: 'SpaceX',
  mode: 'detailed',
  limit: '20',
}).toString()

export async function getRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const data = await fetchJson<PaginatedResponseDto<LauncherConfigDto>>(
    `/config/launcher/?${LIST_QUERY}`,
    signal,
  )
  return data.results.map(toRocket)
}

export async function getRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
  const data = await fetchJson<LauncherConfigDto>(
    `/config/launcher/${encodeURIComponent(id)}/`,
    signal,
  )
  return toRocket(data)
}

export function toRocket (dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: dto.full_name || dto.name,
    description: text(dto.description),
    imageUrl: text(dto.image_url),
    launchCost: parseCost(dto.launch_cost),
    country: text(dto.manufacturer?.country_code),
    firstFlight: text(dto.maiden_flight),
    family: text(dto.family),
    variant: text(dto.variant),
    alias: text(dto.alias),
    active: dto.active ?? null,
    reusable: dto.reusable ?? null,
    infoUrl: text(dto.info_url),
    wikiUrl: text(dto.wiki_url),
    manufacturer: dto.manufacturer ? toManufacturer(dto.manufacturer) : null,
    programs: (dto.program ?? []).map(program => program.name),
    specs: {
      length: num(dto.length),
      diameter: num(dto.diameter),
      launchMass: num(dto.launch_mass),
      leoCapacity: num(dto.leo_capacity),
      gtoCapacity: num(dto.gto_capacity),
      thrust: num(dto.to_thrust),
      minStage: num(dto.min_stage),
      maxStage: num(dto.max_stage),
      apogee: num(dto.apogee),
      vehicleRange: num(dto.vehicle_range),
    },
    stats: toStats(dto),
    isLocal: false,
  }
}

function toManufacturer (dto: LauncherManufacturerDto): RocketManufacturer {
  return {
    name: dto.name,
    abbrev: text(dto.abbrev),
    type: text(dto.type),
    description: text(dto.description),
    administrator: text(dto.administrator),
    foundingYear: text(dto.founding_year),
    logoUrl: text(dto.logo_url),
    infoUrl: text(dto.info_url),
    wikiUrl: text(dto.wiki_url),
  }
}

/** Returns `null` when the API has no launch record at all. */
function toStats (dto: LauncherConfigDto): RocketStats | null {
  if (dto.total_launch_count == null) return null
  return {
    totalLaunches: dto.total_launch_count,
    successfulLaunches: dto.successful_launches ?? 0,
    failedLaunches: dto.failed_launches ?? 0,
    pendingLaunches: dto.pending_launches ?? 0,
    consecutiveSuccessfulLaunches: dto.consecutive_successful_launches ?? 0,
    attemptedLandings: dto.attempted_landings ?? 0,
    successfulLandings: dto.successful_landings ?? 0,
    failedLandings: dto.failed_landings ?? 0,
    consecutiveSuccessfulLandings: dto.consecutive_successful_landings ?? 0,
  }
}

/** Normalizes empty strings to `null`. */
function text (value: string | null | undefined): string | null {
  return value?.trim() || null
}

function num (value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parseCost (value: string | null | undefined): number | null {
  if (!value) return null
  const cost = Number(value)
  return Number.isFinite(cost) ? cost : null
}
