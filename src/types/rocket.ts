export interface RocketManufacturerDto {
  name?: string | null
  country_code?: string | null
}

export interface RocketApiDto {
  id: number
  full_name?: string | null
  name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  manufacturer?: RocketManufacturerDto | null
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous?: string | null
  results: RocketApiDto[]
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  country: string | null
  maidenFlight: string | null
  isLocal: boolean
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface NewRocketInput {
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  country: string | null
  maidenFlight: string | null
}
