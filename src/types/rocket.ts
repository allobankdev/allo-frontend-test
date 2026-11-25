
export interface RocketManufacturer {
  name: string | null
  country_code: string | null
}

export interface Rocket {
  id: string | number
  image_url: string | null
  full_name: string
  description: string | null
  launch_cost: string | number | null
  manufacturer: RocketManufacturer | null
  maiden_flight: string | null
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  image_url: string
  full_name: string
  description: string
  launch_cost: string | number | null
  country_code: string
  maiden_flight: string | null
}
