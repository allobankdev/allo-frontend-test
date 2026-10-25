export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface RocketListResponse {
  results: Rocket[]
}
