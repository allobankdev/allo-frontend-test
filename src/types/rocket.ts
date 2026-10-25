export interface RocketManufacturer {
  country_code?: string | null
}

export interface Rocket {
  id: number | string
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: number | string | null
  manufacturer?: RocketManufacturer | null
  maiden_flight?: string | null

  // Hanya untuk rocket yang ditambahkan user.
  isLocal?: boolean
}

export interface RocketListResponse {
  results: Rocket[]
}

export interface NewRocketInput {
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: string
  country_code?: string
  maiden_flight?: string
}