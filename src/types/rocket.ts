export interface Rocket {
  id: number | string
  full_name: string
  description: string
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    country_code: string | null
  } | null
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface NewRocket {
  full_name: string
  description: string
  image_url?: string
  launch_cost?: string
  maiden_flight?: string
  country_code?: string
}
