export interface ApiLauncher {
  id: number
  full_name?: string | null
  name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: {
    name?: string | null
    country_code?: string | null
  } | null
}

export interface ApiListResponse<T> {
  count: number
  next: string | null
  results: T[]
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  country: string | null
  firstFlight: string | null
  isLocal: boolean
}

export type NewRocketInput = Omit<Rocket, 'id' | 'isLocal'>

export type AsyncStatus = 'idle' | 'loading' | 'error' | 'success'

