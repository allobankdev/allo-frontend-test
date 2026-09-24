/**
 * types/rocket.ts
 *
 * Launch Library 2 (v2.2.0) response shapes, limited to the fields this app reads,
 * plus the normalized `Rocket` model the UI works with.
 */

/** `manufacturer` object nested in a launcher configuration. */
export interface ApiManufacturer {
  name?: string | null
  country_code?: string | null
}

/** A `config/launcher` item (`mode=detailed`). Every field except `id` may be missing or null. */
export interface ApiLauncherConfig {
  id: number
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  /** The API returns this as a numeric string, e.g. "7000000". */
  launch_cost?: string | number | null
  /** ISO date, e.g. "2006-03-24". */
  maiden_flight?: string | null
  manufacturer?: ApiManufacturer | null
}

export interface ApiPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type RocketSource = 'api' | 'local'

/**
 * Normalized rocket used by both API rockets and rockets added locally.
 * Optional values are `null` rather than `undefined` or empty strings.
 */
export interface Rocket {
  /** API ids are numeric strings; local ids are prefixed with `local-`. */
  id: string
  source: RocketSource
  name: string
  description: string | null
  imageUrl: string | null
  /** In USD. */
  launchCost: number | null
  country: string | null
  /** ISO date string (YYYY-MM-DD). */
  firstFlight: string | null
}

/** Fields supplied by the Add Rocket form. */
export type NewRocketInput = Omit<Rocket, 'id' | 'source'>
