export interface NewRocketInput {
  name: string
  description: string
  image_url: string
  family: string
  active: boolean
  reusable: boolean
}

export interface Rocket {
  id: number
  url: string
  name: string
  active: boolean
  reusable: boolean
  full_name: string | null
  description: string | null
  family: string
  manufacturer: RocketManufacturer | null
  program: RocketProgram[]
  variant: string
  alias: string
  min_stage: number | null
  max_stage: number | null
  length: number | null
  diameter: number | null
  maiden_flight: string | null
  launch_cost: string | null
  launch_mass: number | null
  leo_capacity: number | null
  gto_capacity: number | null
  to_thrust: number | null
  apogee: number | null
  vehicle_range: number | null
  image_url: string | null
  info_url: string | null
  wiki_url: string | null
  total_launch_count: number | null
  consecutive_successful_launches: number | null
  successful_launches: number | null
  failed_launches: number | null
  pending_launches: number | null
  attempted_landings: number | null
  successful_landings: number | null
  failed_landings: number | null
  consecutive_successful_landings: number | null
}

export interface RocketAgency {
  id: number
  url: string
  name: string
  type: string | null
}

export interface RocketManufacturer extends RocketAgency {
  featured: boolean
  country_code: string
  abbrev: string
  description: string | null
  administrator: string | null
  founding_year: string | null
  launchers: string
  spacecraft: string
  launch_library_url: string | null
  total_launch_count: number | null
  consecutive_successful_launches: number | null
  successful_launches: number | null
  failed_launches: number | null
  pending_launches: number | null
  consecutive_successful_landings: number | null
  successful_landings: number | null
  failed_landings: number | null
  attempted_landings: number | null
  info_url: string | null
  wiki_url: string | null
  logo_url: string | null
  image_url: string | null
  nation_url: string | null
}

export interface RocketProgram {
  id: number
  url: string
  name: string
  description: string | null
  agencies: RocketAgency[]
  image_url: string | null
  start_date: string | null
  end_date: string | null
  info_url: string | null
  wiki_url: string | null
  mission_patches: RocketMissionPatch[]
  type: RocketProgramType
}

export interface RocketProgramType {
  id: number
  name: string
}

export interface RocketMissionPatch {
  id: number
  name: string
  priority: number
  image_url: string
  agency: RocketAgency | null
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}
