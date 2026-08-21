export interface Manufacturer {
  id: number
  name: string
  country_code: string
  description?: string
  administrator?: string
  founding_year?: string
  logo_url?: string | null
  image_url?: string | null
}

export interface Rocket {
  id: number
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: Manufacturer
  active: boolean
  reusable?: boolean
  family?: string
  variant?: string
  min_stage?: number | null
  max_stage?: number | null
  length?: number | null
  diameter?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  total_launch_count?: number
  consecutive_successful_launches?: number
  successful_launches?: number
  failed_launches?: number
  pending_launches?: number
  wiki_url?: string | null
  info_url?: string | null
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  name: string
  full_name: string
  description: string
  image_url?: string
  launch_cost?: string
  country_code?: string
  maiden_flight?: string
  active?: boolean
}
