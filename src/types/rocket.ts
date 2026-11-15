/**
 * types/rocket.ts
 *
 * Launch Library 2 (v2.2.0) response shapes and the app's normalized Rocket model.
 * Optional API fields are typed as possibly missing (`?`) and/or `null`.
 */

/** Subset of `manufacturer` returned by `/config/launcher/` (mode=detailed). */
export interface LauncherManufacturerDto {
  id: number
  name: string
  type?: string | null
  abbrev?: string | null
  country_code?: string | null
  description?: string | null
  administrator?: string | null
  founding_year?: string | null
  logo_url?: string | null
  info_url?: string | null
  wiki_url?: string | null
}

export interface LauncherProgramDto {
  id: number
  name: string
}

/** Launcher configuration returned by `/config/launcher/` (mode=detailed). */
export interface LauncherConfigDto {
  id: number
  name: string
  full_name?: string | null
  description?: string | null
  family?: string | null
  variant?: string | null
  alias?: string | null
  active?: boolean | null
  reusable?: boolean | null
  image_url?: string | null
  info_url?: string | null
  wiki_url?: string | null
  /** LL2 returns the cost as a numeric string, e.g. "52000000". */
  launch_cost?: string | null
  /** ISO date, e.g. "2018-05-11". */
  maiden_flight?: string | null
  manufacturer?: LauncherManufacturerDto | null
  program?: LauncherProgramDto[] | null

  min_stage?: number | null
  max_stage?: number | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  apogee?: number | null
  vehicle_range?: number | null

  total_launch_count?: number | null
  successful_launches?: number | null
  failed_launches?: number | null
  pending_launches?: number | null
  consecutive_successful_launches?: number | null
  attempted_landings?: number | null
  successful_landings?: number | null
  failed_landings?: number | null
  consecutive_successful_landings?: number | null
}

export interface PaginatedResponseDto<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface RocketManufacturer {
  name: string
  abbrev: string | null
  type: string | null
  description: string | null
  administrator: string | null
  foundingYear: string | null
  logoUrl: string | null
  infoUrl: string | null
  wikiUrl: string | null
}

export interface RocketSpecs {
  /** Meters. */
  length: number | null
  /** Meters. */
  diameter: number | null
  /** Tonnes. */
  launchMass: number | null
  /** Payload to low Earth orbit, kg. */
  leoCapacity: number | null
  /** Payload to geostationary transfer orbit, kg. */
  gtoCapacity: number | null
  /** Thrust at liftoff, kN. */
  thrust: number | null
  minStage: number | null
  maxStage: number | null
  /** Kilometers. */
  apogee: number | null
  /** Kilometers. */
  vehicleRange: number | null
}

export interface RocketStats {
  totalLaunches: number
  successfulLaunches: number
  failedLaunches: number
  pendingLaunches: number
  consecutiveSuccessfulLaunches: number
  attemptedLandings: number
  successfulLandings: number
  failedLandings: number
  consecutiveSuccessfulLandings: number
}

/** Normalized rocket used across the app. Missing API values become `null`. */
export interface Rocket {
  /** API rockets use the LL2 id as a string; local rockets use a `local-` prefix. */
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** Cost per launch in USD. */
  launchCost: number | null
  /** Manufacturer country code, e.g. "USA". */
  country: string | null
  /** ISO date of the maiden flight. */
  firstFlight: string | null

  family: string | null
  variant: string | null
  alias: string | null
  active: boolean | null
  reusable: boolean | null
  infoUrl: string | null
  wikiUrl: string | null
  manufacturer: RocketManufacturer | null
  programs: string[]
  specs: RocketSpecs
  /** `null` when there is no launch record (e.g. locally added rockets). */
  stats: RocketStats | null

  isLocal: boolean
}

/** Fields the user must provide when adding a rocket. */
type RocketCoreFields = 'name' | 'description' | 'imageUrl' | 'launchCost' | 'country' | 'firstFlight'

/** Payload for adding a rocket in the running app. Extra details are optional. */
export type NewRocketInput = Pick<Rocket, RocketCoreFields>
  & Partial<Omit<Rocket, RocketCoreFields | 'id' | 'isLocal' | 'specs'>>
  & { specs?: Partial<RocketSpecs> }

export type RocketSource = 'all' | 'api' | 'local'

export interface RocketFilters {
  /** Matches name and description (case-insensitive). */
  query: string
  /** Country code; `null` means any country. */
  country: string | null
  source: RocketSource
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
