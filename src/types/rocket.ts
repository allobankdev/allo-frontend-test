export interface RocketCreate {
  full_name: string,
  description: string,
  image_url: string, 
  launch_cost: number | null, 
  maiden_flight: string | null, 
  country_code: string | null | undefined
}

export interface RocketManufacturer {
  id: number;
  url: string;
  name: string | null;
  featured: boolean;
  type: string | null;
  country_code: string | null;
  abbrev: string | null;
  description: string | null;
  administrator: string | null;
  founding_year: string | null;
  launchers: string | null;
  spacecraft: string | null;
  launch_library_url: string | null;
  total_launch_count: number | null;
  consecutive_succesful_launches: number | null;
  successful_launches: number | null;
  failed_launches: number | null;
  pending_launches: number | null;
  consecutive_successful_landings: number | null;
  successful_landings: number | null;
  failed_landings: number | null;
  attempted_landings: number | null;
  info_url: string | null;
  wiki_url: string | null;
  logo_url: string | null;
  image_url: string | null;
  nation_url: string | null;
}

export interface RocketAgencies {
    id: number;
    url: string | null;
    name: string | null;
    type: string | null;
}

export interface ProgramTypes {
    id: number;
    name: string | null;
}

export interface RocketProgram {
  id: number;
  url: string;
  name: string | null;
  description: string | null;
  agencies: RocketAgencies[]
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  info_url: string | null;
  wiki_url: string | null;
  mission_patches: [];
  type: ProgramTypes
}

export interface RocketResults {
  id: number;
  url: string;
  name: string | null;
  active: boolean;
  reusable: boolean;
  description: string | null;
  family: string | null;
  full_name: string | null;
  manufacturer: RocketManufacturer | null;
  program: RocketProgram[];
  variant: string | null;
  alias: string | null;
  min_stage: number | null;
  max_stage: number | null;
  length: number | null;
  diameter: number | null;
  maiden_flight: string | null;
  launch_cost: string | null;
  launch_mass: number | null;
  leo_capacity: number | null;
  gto_capacity: number | null;
  to_thrust: number | null;
  apogee: number | null;
  vehicle_range: number | null;
  image_url: string | null;
  info_url: string | null;
  wiki_url: string | null;
  total_launch_count: number | null;
  consecutive_successful_launches: number | null;
  successful_launches: number | null;
  failed_launches: number | null;
  pending_launches: number | null;
  attempted_landings: number | null;
  successful_landings: number | null;
  failed_landings: number | null;
  consecutive_successful_landings: number | null;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previouse: string | null;
  results: RocketResults[];
}
