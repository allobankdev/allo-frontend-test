/**
 * types/rocket.ts
 *
 * `Api*` types describe the raw Launch Library 2 (v2.2.0) payload.
 * `Rocket` is the app's own model — components only use this one.
 */

// ---- Raw API shape ----

export interface ApiManufacturer {
  id: number
  name?: string | null
  country_code?: string | null
}

export interface ApiRocket {
  id: number
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  /** Sent as a numeric string, e.g. "50000000". */
  launch_cost?: string | number | null
  /** ISO date, e.g. "2015-12-22". */
  maiden_flight?: string | null
  active?: boolean | null
  manufacturer?: ApiManufacturer | null
}

export interface ApiPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ---- App model ----

export interface Rocket {
  /** String so API ids and user-created ids share one key space (and match route params). */
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** In USD. */
  launchCost: number | null
  /** ISO 3166-1 alpha-3, e.g. "USA". */
  countryCode: string | null
  /** ISO date (YYYY-MM-DD). */
  firstFlight: string | null
  active: boolean | null
  /** True for rockets added by the user in this session. */
  isCustom: boolean
}