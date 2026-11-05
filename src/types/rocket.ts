export interface Manufacturer {
  id?: number
  url?: string
  name?: string
  country_code?: string | null
  abbrev?: string
  type?: string
  description?: string | null
  logo_url?: string | null
  image_url?: string | null
}

export interface Rocket {
  id: number | string
  url?: string
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  active?: boolean | null
  reusable?: boolean | null
  family?: string
  variant?: string
  alias?: string
  min_stage?: number | null
  max_stage?: number | null
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
  manufacturer?: Manufacturer | null
  is_custom?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketPayload {
  name: string
  full_name: string
  description: string
  image_url?: string | null
  launch_cost?: string | number | null
  country_code?: string | null
  maiden_flight?: string | null
  active?: boolean
  reusable?: boolean
}

