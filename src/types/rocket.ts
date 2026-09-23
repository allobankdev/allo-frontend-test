export interface RocketManufacturer {
  id?: number
  url?: string
  name?: string
  country_code?: string
  abbrev?: string
  description?: string
  administrator?: string
  founding_year?: string
  info_url?: string | null
  wiki_url?: string | null
  logo_url?: string | null
  image_url?: string | null
}

export interface Rocket {
  id: number | string
  url?: string
  name: string
  full_name: string
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  active?: boolean | null
  reusable?: boolean | null
  family?: string | null
  variant?: string | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  total_launch_count?: number | null
  consecutive_successful_launches?: number | null
  successful_launches?: number | null
  failed_launches?: number | null
  pending_launches?: number | null
  attempted_landings?: number | null
  successful_landings?: number | null
  failed_landings?: number | null
  consecutive_successful_landings?: number | null
  info_url?: string | null
  wiki_url?: string | null
  manufacturer?: RocketManufacturer | null
  // Flag for user-added rockets
  is_custom?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketPayload {
  full_name: string
  description: string
  image_url?: string
  launch_cost?: string | number
  country_code?: string
  maiden_flight?: string
  active?: boolean
  reusable?: boolean
}
