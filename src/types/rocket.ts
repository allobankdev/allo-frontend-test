export interface Manufacturer {
  id?: number
  url?: string
  name?: string
  featured?: boolean
  type?: string
  country_code?: string
  abbrev?: string
  description?: string
}

export interface Rocket {
  id: number | string
  url?: string
  name: string
  active?: boolean | null
  reusable?: boolean | null
  description?: string | null
  family?: string | null
  full_name: string
  manufacturer?: Manufacturer | null
  program?: any[]
  variant?: string | null
  alias?: string | null
  min_stage?: number | null
  max_stage?: number | null
  length?: number | null
  diameter?: number | null
  maiden_flight?: string | null
  launch_cost?: string | number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  apogee?: number | null
  vehicle_range?: number | null
  image_url?: string | null
  info_url?: string | null
  wiki_url?: string | null
  total_launch_count?: number
  consecutive_successful_launches?: number
  successful_launches?: number
  failed_launches?: number
  pending_launches?: number
  attempted_landings?: number
  successful_landings?: number
  failed_landings?: number
  consecutive_successful_landings?: number
  is_local?: boolean
}

export interface CreateRocketDto {
  name: string
  full_name?: string
  description?: string
  image_url?: string
  launch_cost?: number | string
  country_code?: string
  maiden_flight?: string
  active?: boolean
  reusable?: boolean
}

export interface ApiRocketResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'
