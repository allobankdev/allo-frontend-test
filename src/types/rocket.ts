export interface Rocket {
  id: string | number
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: {
    name?: string | null
    country_code?: string | null
  } | null
  isLocal?: boolean
}

export interface RocketListResponse {
  results?: Rocket[]
}
