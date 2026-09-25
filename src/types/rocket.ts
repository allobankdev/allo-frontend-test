export interface RocketManufacturer {
  name?: string
  country_code?: string
}

export interface Rocket {
  id: number | string
  full_name: string
  description?: string | null
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  manufacturer?: RocketManufacturer | null
}
