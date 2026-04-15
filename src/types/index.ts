// ─── Rocket ────

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
  height: Dimension
  diameter: Dimension
  mass: Mass
  company: string
  wikipedia: string
  type: string
}

export interface Dimension {
  meters: number | null
  feet: number | null
}

export interface Mass {
  kg: number
  lb: number
}

// ─── Local Rocket ────

export interface LocalRocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  isLocal: true
}

// ─── UI State ───

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
