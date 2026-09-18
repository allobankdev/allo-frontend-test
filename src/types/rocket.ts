export interface Manufacturer {
  id?: number
  url?: string
  name?: string
  country_code?: string | null
  abbrev?: string | null
  type?: string | null
  description?: string | null
  administrator?: string | null
  founding_year?: string | null
  launchers?: string | null
  spacecraft?: string | null
  logo_url?: string | null
  image_url?: string | null
}

export interface Rocket {
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
  launch_cost: string | null
  maiden_flight: string | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  vehicle_range?: number | null
  total_launch_count?: number | null
  successful_launches?: number | null
  failed_launches?: number | null
  consecutive_successful_launches?: number | null
  attempted_landings?: number | null
  successful_landings?: number | null
  failed_landings?: number | null
  consecutive_successful_landings?: number | null
  info_url?: string | null
  wiki_url?: string | null
  manufacturer?: Manufacturer | null
  isCustom?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketPayload {
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: string
  country_code?: string
  maiden_flight?: string
  family?: string
  active?: boolean
  reusable?: boolean
}
