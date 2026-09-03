export interface Manufacturer {
  id?: number | null
  name?: string | null
  country_code?: string | null
}

export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer?: Manufacturer | null
  active?: boolean
  reusable?: boolean
}

export interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type SortOption = 'DEFAULT' | 'NAME_ASC' | 'NAME_DESC'

export interface RocketFilterState {
  searchQuery: string
  country: string
  sortBy: SortOption
}

export type CreateRocketInput = Omit<Rocket, 'id'>
