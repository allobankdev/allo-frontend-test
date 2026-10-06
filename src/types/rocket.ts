export interface LauncherApi {
  id: number
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string | null
  } | null
}

export interface LauncherListResponse {
  results: LauncherApi[]
}

export interface Rocket {
  id: string
  source: 'api' | 'local'
  name: string
  description: string
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  firstFlight: string | null
}

export interface NewRocketInput {
  name: string
  description: string
  imageUrl?: string
  launchCost?: string
  country?: string
  firstFlight?: string
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RocketDetailState {
  status: RequestStatus
  rocket: Rocket | null
  errorMessage: string | null
}
