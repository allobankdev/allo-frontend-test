export interface RocketManufacturer {
  id?: number
  name?: string | null
  country_code?: string | null
}

export interface Rocket {
  id: number
  url?: string
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: RocketManufacturer | null
  isLocal?: boolean
}

export interface RocketListResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  name: string
  description: string
  image_url: string
  launch_cost: number | null
  manufacturer_country: string
  maiden_flight: string
}
