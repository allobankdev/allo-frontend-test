export interface RocketManufacturer {
  name: string
  country_code: string | null
}

export interface Rocket {
  id: number
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer
}

export interface LauncherListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type RequestStatus = 'idle' | 'loading' | 'error' | 'success'

export interface NewRocketInput {
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  country_code: string | null
}
