export interface RocketManufacturer {
  country_code: string | null
  name?: string | null
}

export interface Rocket {
  id: number | string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  country_code: string
  maiden_flight: string
}
