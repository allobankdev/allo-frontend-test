export interface ManufacturerApiResponse {
  id: number
  url: string
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
  launch_library_url?: string | null
  total_launch_count?: number
  consecutive_successful_launches?: number
  successful_launches?: number
  failed_launches?: number
  pending_launches?: number
  consecutive_successful_landings?: number
  successful_landings?: number
  failed_landings?: number
  attempted_landings?: number
  info_url?: string | null
  wiki_url?: string | null
  logo_url?: string | null
  image_url?: string | null
  nation_url?: string | null
}

export interface LauncherConfigApiResponse {
  id: number
  url: string
  name: string
  active?: boolean
  reusable?: boolean
  description: string | null
  family?: string
  full_name: string
  manufacturer: ManufacturerApiResponse | null
  program?: unknown[]
  variant?: string
  alias?: string
  min_stage?: number | null
  max_stage?: number | null
  length?: number | null
  diameter?: number | null
  maiden_flight: string | null
  launch_cost: string | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
  to_thrust?: number | null
  apogee?: number | null
  vehicle_range?: number | null
  image_url: string | null
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
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
