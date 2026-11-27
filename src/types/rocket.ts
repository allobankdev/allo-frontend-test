export interface RocketManufacturer {
  id?: number
  name?: string
  country_code?: string | null
  type?: string
  description?: string | null
}

export interface Rocket {
  id: number | string
  name?: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  manufacturer?: RocketManufacturer | null
  country?: string | null
  active?: boolean
  reusable?: boolean
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  wiki_url?: string | null
  info_url?: string | null
  is_local?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: string | number
  country_code?: string
  maiden_flight?: string
}
