/**
 * Domain model used throughout the app. This is intentionally decoupled from
 * the raw Launch Library API shape (see services/rocketApi.ts) so that
 * locally-added rockets can be represented with the exact same type.
 */
export interface Rocket {
  /** API rockets use a numeric id; locally-added rockets use a "local-*" string id. */
  id: number | string
  name: string
  fullName: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  maidenFlight: string | null
  /** True for rockets created in the "Add rocket" form (not persisted to any API). */
  isLocal?: boolean
}

/** Shape returned by the Launch Library 2 API (2.2.0, mode=detailed). */
export interface RocketApiResult {
  id: number
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface RocketListApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: RocketApiResult[]
}
