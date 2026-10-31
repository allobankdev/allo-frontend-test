export interface Manufacturer {
  id?: number
  name?: string
  country_code?: string | null
}

export interface Rocket {
  id: number | string
  name?: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  manufacturer?: Manufacturer | null
  isCustom?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface CreateRocketPayload {
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: string | number
  country_code?: string
  maiden_flight?: string
}
