/**
 * types/rocket.ts
 *
 * Shapes returned by Launch Library 2 (API v2.2.0).
 * Every field the API can return as `null` is typed accordingly so the UI
 * is forced to handle missing data.
 */

export interface RocketManufacturer {
  id: number
  name: string
  country_code: string | null
}

export interface Rocket {
  id: number
  /** Short name, e.g. "Falcon 9". */
  name: string
  /** Name shown in the UI, e.g. "Falcon 9 Block 5". */
  full_name: string
  description: string | null
  image_url: string | null
  /** Returned by the API as a numeric string, e.g. "7000000". */
  launch_cost: string | null
  /** ISO date, e.g. "2010-06-04". */
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  /** True for rockets created in the app, since the API is read-only. */
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

/** Payload collected by the "add rocket" form. */
export interface NewRocket {
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  country_code: string | null
  maiden_flight: string | null
}
