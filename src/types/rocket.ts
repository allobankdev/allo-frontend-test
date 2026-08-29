/**
 * Rocket types based on SpaceX API
 */

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active?: boolean
  company?: string
  diameter?: {
    meters: number
  }
  height?: {
    meters: number
  }
  mass?: {
    kg: number
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

