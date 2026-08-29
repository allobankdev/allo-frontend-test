/**
 * Rocket Types
 */

export interface Rocket {
  id: string
  name: string
  type: string
  description: string
  rocket_id?: string
  height?: {
    meters: number
    feet: number
  }
  diameter?: {
    meters: number
    feet: number
  }
  mass?: {
    kg: number
    lb: number
  }
  stages?: number
  engines?: number
  cost_per_launch?: number
  country?: string
  first_flight?: string
  flickr_images?: string[]
  wikipedia?: string
  active?: boolean
   image?: string
}

export interface RocketListState {
  rockets: Rocket[]
  loading: boolean
  error: string | null
  currentFilter: string
}

export interface RocketDetailState {
  rocket: Rocket | null
  loading: boolean
  error: string | null
}
