export type UiStatus = 'idle' | 'loading' | 'success' | 'error'

// Minimal subset of SpaceX Rocket (v4) fields we need.
export type SpacexRocket = {
  id: string
  name: string
  description: string
  active: boolean
  country: string
  first_flight: string
  cost_per_launch: number
  flickr_images: string[]
}

// App-level Rocket model (supports both API rockets and locally-added rockets)
export type Rocket = {
  id: string
  name: string
  description: string
  active?: boolean
  country: string
  first_flight: string
  cost_per_launch: number
  imageUrl: string
  isLocal?: boolean
}

export type NewRocketInput = Omit<Rocket, 'id'>
