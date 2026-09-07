export interface Manufacturer {
  id: number
  name: string
  country_code: string
}

export interface Rocket {
  id: number
  name: string
  full_name: string
  description: string
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: Manufacturer
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocket {
  id: number
  name: string
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  maiden_flight: string
  manufacturer: Manufacturer
}
