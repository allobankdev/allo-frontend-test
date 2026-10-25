export interface RocketManufacturer {
  id: number
  name: string
  country_code: string | null
}

export interface Rocket {
  id: number
  full_name: string | null
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

export interface NewRocketPayload {
  full_name: string
  description: string
  image_url?: string
  launch_cost?: string
  maiden_flight?: string
  country_code?: string
}
