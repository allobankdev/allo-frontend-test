export interface Manufacturer {
  id?: number
  url?: string
  name: string
  featured?: boolean
  type?: string
  country_code?: string | null
  abbrev?: string
  description?: string
  administrator?: string
  founding_year?: string
  launchers?: string
  spacecraft?: string
  logo_url?: string | null
  image_url?: string | null
}

export interface RocketLauncher {
  id: number | string
  url?: string
  name: string
  full_name: string
  description: string | null
  family?: string | null
  variant?: string | null
  active?: boolean | null
  reusable?: boolean | null
  image_url: string | null
  info_url?: string | null
  wiki_url?: string | null
  launch_cost: string | null
  maiden_flight: string | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  apogee?: number | null
  vehicle_range?: number | null
  total_launch_count?: number
  consecutive_successful_launches?: number
  successful_launches?: number
  failed_launches?: number
  pending_launches?: number
  attempted_landings?: number
  successful_landings?: number
  failed_landings?: number
  consecutive_successful_landings?: number
  manufacturer: Manufacturer | null
  is_custom?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: RocketLauncher[]
}

export interface NewRocketInput {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  country_code: string
  maiden_flight: string
  active?: boolean
  family?: string
}
