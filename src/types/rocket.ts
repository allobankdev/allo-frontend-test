/**
 * types/rocket.ts
 *
 * Type definitions for Rocket data from Launch Library 2 API v2.2.0
 */

export interface RocketManufacturer {
  name: string
  country_code: string
}

export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  // used for locally-added rockets
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type FilterStatus = 'all' | 'with-image' | 'no-image'

