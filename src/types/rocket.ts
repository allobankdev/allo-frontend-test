export interface Manufacturer {
  id?: number
  url?: string
  name?: string
  country_code?: string | null
}

export interface Rocket {
  id: number | string
  url?: string
  name?: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | number | null
  maiden_flight: string | null
  manufacturer?: Manufacturer | null
  is_custom?: boolean
}

export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'
