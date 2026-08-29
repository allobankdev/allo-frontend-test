export interface SpaceXRocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active: boolean
  company?: string
  success_rate_pct?: number
  wikipedia?: string
  height?: { meters?: number | null }
  diameter?: { meters?: number | null }
  mass?: { kg?: number | null }
}

export interface Rocket {
  id: string
  name: string
  description: string
  image: string
  costPerLaunch: number
  country: string
  firstFlight: string
  active: boolean
  source: 'api' | 'local'
}

export interface RocketDraft {
  name: string
  description: string
  image: string
  costPerLaunch: number
  country: string
  firstFlight: string
  active: boolean
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
