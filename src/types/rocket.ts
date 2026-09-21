export interface Manufacturer {
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
  manufacturer: Manufacturer | null
  active: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  results: Rocket[]
}

export interface NewRocketForm {
  full_name: string
  description: string
  image_url: string
}
