/**
 * Manufacturer details returned by Launch Library 2 API v2.2.0.
 */
export interface RocketManufacturer {
  id?: number
  name?: string | null
  country_code?: string | null
}

/**
 * Rocket (LauncherConfig) entity returned by Launch Library 2 API v2.2.0.
 * All fields except `id` may be missing or `null`.
 */
export interface Rocket {
  id: number
  full_name?: string | null
  image_url?: string | null
  description?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: RocketManufacturer | null
}

/**
 * Paginated rocket list response from Launch Library 2 API v2.2.0.
 */
export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}
