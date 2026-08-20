export type RocketId = number | string

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RocketManufacturer {
  id?: number
  name?: string | null
  country_code: string | null
}

export interface Rocket {
  id: RocketId
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  is_local?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export interface NewRocketInput {
  fullName: string
  description: string
  imageUrl: string
  launchCost: string
  countryCode: string
  maidenFlight: string
}

export interface DetailLoadState {
  status: LoadStatus
  error: string | null
}
