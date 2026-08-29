export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active: boolean
  stages: number
  boosters: number
  success_rate_pct: number
  company: string
  wikipedia: string
  height: {
    meters: number
    feet: number
  }
  diameter: {
    meters: number
    feet: number
  }
  mass: {
    kg: number
    lb: number
  }
  engines: {
    number: number
    type: string
    version: string
  }
}

export interface RocketFormData {
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
