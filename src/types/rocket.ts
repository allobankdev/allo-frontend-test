export interface ApiRocketManufacturer {
  id?: number
  name?: string | null
  country_code?: string | null
}

export interface ApiRocket {
  id: number
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  manufacturer?: ApiRocketManufacturer | null
}

export interface ApiRocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: ApiRocket[]
}

export interface Rocket {
  id: string
  fullName: string
  description: string
  imageUrl: string | null
  launchCost: string | null
  countryCode: string | null
  maidenFlight: string | null
  isLocal: boolean
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AddRocketPayload {
  fullName: string
  description?: string
  imageUrl?: string | null
  launchCost?: string | null
  countryCode?: string | null
  maidenFlight?: string | null
}
