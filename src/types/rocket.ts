export interface Root {
  count: number
  next: any
  previous: any
  results: Result[]
}
export interface Countryside{
  country_code: string
}
export interface ResultForm{
  id: number
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  maiden_flight: string
  manufacturer: Countryside
}
export interface Result {
  id: number
  url: string
  name: string
  active: boolean
  reusable: boolean
  description: string
  family: string
  full_name: string
  manufacturer: Manufacturer
  program: Program[]
  variant: string
  alias: string
  min_stage: number
  max_stage: number
  length: number
  diameter: number
  maiden_flight?: string
  launch_cost?: string
  launch_mass: number
  leo_capacity?: number
  gto_capacity?: number
  to_thrust?: number
  apogee?: number
  vehicle_range: any
  image_url?: string
  info_url?: string
  wiki_url: string
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

export interface Manufacturer {
  id: number
  url: string
  name: string
  featured: boolean
  type: string
  country_code: string
  abbrev: string
  description: string
  administrator: string
  founding_year: string
  launchers: string
  spacecraft: string
  launch_library_url: any
  total_launch_count: number
  consecutive_successful_launches: number
  successful_launches: number
  failed_launches: number
  pending_launches: number
  consecutive_successful_landings: number
  successful_landings: number
  failed_landings: number
  attempted_landings: number
  info_url: string
  wiki_url: string
  logo_url: string
  image_url: string
  nation_url: string
}

export interface Program {
  id: number
  url: string
  name: string
  description: string
  agencies: Agency[]
  image_url: string
  start_date: string
  end_date: any
  info_url?: string
  wiki_url: string
  mission_patches: any[]
  type: Type
}

export interface Agency {
  id: number
  url: string
  name: string
  type: string
}

export interface Type {
  id: number
  name: string
}
