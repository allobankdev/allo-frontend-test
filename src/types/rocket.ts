export interface RocketManufacturer {
  id?: number
  name?: string
  country_code?: string | null
  abbrev?: string
  description?: string
  administrator?: string
  founding_year?: string
  [key: string]: unknown
}

export interface RocketItem {
  id: number | string
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  manufacturer?: RocketManufacturer | null
  family?: string | null
  variant?: string | null
  active?: boolean | null
  reusable?: boolean | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  total_launch_count?: number | null
  successful_launches?: number | null
  failed_launches?: number | null
  isCustom?: boolean
  [key: string]: unknown
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: RocketItem[]
}

export interface CreateRocketPayload {
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: string | number
  country_code?: string
  maiden_flight?: string
  active?: boolean
  reusable?: boolean
}
