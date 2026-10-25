// ============================================================
// Types & Interfaces — Launch Library 2 v2.2.0
// Endpoint: /2.2.0/config/launcher/
// ============================================================

export interface RocketManufacturer {
  id: number
  url: string
  name: string
  type: string
  country_code: string   // e.g. "USA"
  abbrev: string
  description: string | null
  administrator: string | null
  founding_year: string | null
  launchers: string
  spacecraft: string
  image_url: string | null
  logo_url: string | null
  wiki_url: string | null
  info_url: string | null
  total_launch_count: number
  consecutive_successful_launches: number
  successful_launches: number
  failed_launches: number
  pending_launches: number
  attempted_landings: number
  successful_landings: number
  failed_landings: number
  consecutive_successful_landings: number
}

export interface RocketProgram {
  id: number
  url: string
  name: string
  description: string | null
  agencies: { id: number; url: string; name: string; type: string }[]
  image_url: string | null
  start_date: string | null
  end_date: string | null
  info_url: string | null
  wiki_url: string | null
}

export interface Rocket {
  id: number
  url: string
  /** e.g. "Falcon 9 Block 5" */
  full_name: string
  /** e.g. "Falcon 9" */
  name?: string
  family: string
  variant: string
  alias: string
  min_stage: number | null
  max_stage: number | null
  length: number | null
  diameter: number | null
  maiden_flight: string | null        // "YYYY-MM-DD"
  launch_cost: string | null          // e.g. "62000000"
  mass_to_leo: string | null
  mass_to_gto: string | null
  mass_to_other: string | null
  leo_capacity: number | null
  gto_capacity: number | null
  to_thrust: number | null
  apogee: number | null
  vac_thrust: number | null
  total_launch_count: number
  consecutive_successful_launches: number
  successful_launches: number
  failed_launches: number
  pending_launches: number
  attempted_landings: number
  successful_landings: number
  failed_landings: number
  consecutive_successful_landings: number
  image_url: string | null
  info_url: string | null
  wiki_url: string | null
  description: string | null
  manufacturer: RocketManufacturer | null
  program: RocketProgram[]
  /** True when this rocket was added locally and not from the API */
  isLocal?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface RocketFilterState {
  search: string
  country: string
}
