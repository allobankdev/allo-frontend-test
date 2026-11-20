/**
 * Rocket model used across the whole app.
 *
 * Every field the API may omit is nullable on purpose: TypeScript will then
 * force each component to handle the "missing data" case instead of
 * assuming the value always exists.
 */
export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** Cost per launch in USD. `null` when the API does not provide it. */
  launchCost: number | null
  /** Manufacturer country code, e.g. "USA". */
  country: string | null
  /** ISO date (YYYY-MM-DD). `null` when the rocket has not flown yet. */
  firstFlight: string | null
  /** True for rockets added by the user inside the running app. */
  isLocal: boolean
}

/** Values the user enters in the "Add rocket" form. */
export interface NewRocketInput {
  name: string
  description?: string
  imageUrl?: string
  launchCost?: number | null
  country?: string
  firstFlight?: string
}

/**
 * Raw shape of one launcher config from Launch Library 2 (v2.2.0).
 * Only the fields this app actually reads are declared.
 */
export interface LauncherConfigDto {
  id: number
  full_name: string | null
  name: string | null
  description: string | null
  image_url: string | null
  /** The API sends cost as a string, e.g. "50000000". */
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: { country_code: string | null } | null
}

/** Raw response of the list endpoint. */
export interface LauncherListResponseDto {
  count: number
  next: string | null
  results: LauncherConfigDto[]
}

/** The three UI states required by the assignment (plus `idle` before the first request). */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
