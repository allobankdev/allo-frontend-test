// Types matching Launch Library 2 API v2.2.0 response shape

export interface RocketManufacturer {
  name: string
  country_code: string
}

export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  // flag to distinguish locally-added rockets from API ones
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}
