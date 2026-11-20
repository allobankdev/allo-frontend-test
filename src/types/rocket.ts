export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export type RocketSortOption = 'default' | 'name-asc' | 'first-flight-desc' | 'cost-asc'

export interface ApiRocket {
  id: number
  full_name?: string | null
  name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: number | string | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string | null
  } | null
}

export interface ApiRocketListResponse {
  count: number
  results: ApiRocket[]
}

export interface Rocket {
  id: string
  fullName: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  maidenFlight: string | null
  isCustom?: boolean
}

export interface NewRocketInput {
  fullName: string
  description: string
  imageUrl?: string
  launchCost?: number | null
  countryCode?: string
  maidenFlight?: string
}
