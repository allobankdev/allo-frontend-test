/**
 * Types and interfaces for SpaceX rocket data and UI state
 */

export interface ManufacturerApi {
  id?: number
  name?: string
  country_code?: string
  description?: string
  logo_url?: string | null
  image_url?: string | null
}

/**
 * Raw Launcher Configuration item from Launch Library 2 API (v2.2.0)
 */
export interface LauncherConfigApi {
  id: number
  url?: string
  name: string
  full_name: string
  description: string | null
  family?: string | null
  variant?: string | null
  active?: boolean | null
  reusable?: boolean | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  manufacturer?: ManufacturerApi | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  total_launch_count?: number
  successful_launches?: number
  failed_launches?: number
}

/**
 * API Response envelope from /2.2.0/config/launcher/
 */
export interface LauncherApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: LauncherConfigApi[]
}

/**
 * Standardized Clean Rocket Model used across the application
 */
export interface Rocket {
  id: number | string
  name: string
  fullName: string
  description: string | null
  launchCost: string | number | null
  countryCode: string | null
  maidenFlight: string | null
  imageUrl: string | null
  family: string | null
  active: boolean
  reusable: boolean
  isCustom?: boolean
}

/**
 * Form payload interface for adding a new rocket in the client app
 */
export interface CreateRocketDto {
  fullName: string
  description: string
  imageUrl?: string
  launchCost?: string | number
  countryCode?: string
  maidenFlight?: string
  family?: string
  active?: boolean
  reusable?: boolean
}

/**
 * Filter statuses for rocket list
 */
export type RocketStatusFilter = 'all' | 'active' | 'retired'
