export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  active: boolean
  reusable: boolean | null
  family: string | null
  variant: string | null
  min_stage: number | null
  max_stage: number | null
  length: number | null
  diameter: number | null
  launch_mass: number | null
  leo_capacity: number | null
  gto_capacity: number | null
  total_launch_count: number | null
  successful_launches: number | null
  failed_launches: number | null
  successful_landings: number | null
  failed_landings: number | null
  wiki_url: string | null
  manufacturer: {
    name: string | null
    country_code: string | null
  } | null
}
