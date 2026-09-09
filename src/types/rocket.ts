/**
 * types/rocket.ts
 *
 * Types for the Launch Library 2 (2.2.0) launcher configuration endpoints,
 * plus the trimmed-down shape the UI actually renders.
 */

/** Agency object nested in a launcher configuration. */
export interface LL2Manufacturer {
  id: number
  name: string | null
  country_code: string | null
}

/** A launcher configuration as returned by `/config/launcher/`. */
export interface LL2Launcher {
  id: number
  name: string | null
  full_name: string | null
  description: string | null
  launch_cost: string | null
  maiden_flight: string | null
  image_url: string | null
  manufacturer: LL2Manufacturer | null
}

/** Paginated envelope used by every LL2 list endpoint. */
export interface LL2ListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * The rocket shape used across the app.
 *
 * Every field the API may omit stays nullable so the UI can decide how to
 * render a gap, rather than each component guarding against `undefined`.
 */
export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  country: string | null
  firstFlight: string | null
  /** True for rockets added in-app, which never exist on the read-only API. */
  isLocal: boolean
}

/** Fields a user supplies when adding a rocket from the list screen. */
export interface NewRocketInput {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  firstFlight: string
}

/** Whether a rocket has flown, based on `maiden_flight`. */
export type FlightStatusFilter = 'all' | 'flown' | 'not_flown'

/** Whether a rocket has a published `launch_cost`. */
export type CostStatusFilter = 'all' | 'has_cost' | 'no_cost'
