export interface Manufacturer {
  id?: number
  name?: string
  country_code?: string | null
}

export interface Rocket {
  id: number
  name: string
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  active?: boolean
  manufacturer?: Manufacturer | null
  isLocal?: boolean
}

export interface NewRocket {
  fullName: string
  description: string
  imageUrl: string
  launchCost: string
  countryCode: string
  maidenFlight: string
  active: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export type ActiveFilter = 'all' | 'active' | 'retired'

export interface RocketFilters {
  search: string | null
  active: ActiveFilter
}
