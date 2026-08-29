/**
 * Rocket type matching SpaceX API v4 response
 * @see https://github.com/r-spacex/SpaceX-API
 */
export interface Rocket {
  id: string
  name: string
  type: string
  active: boolean
  stages: number
  boosters: number
  cost_per_launch: number | null
  success_rate_pct: number | null
  first_flight: string | null
  country: string
  company: string
  description: string | null
  wikipedia: string | null
  flickr_images: string[]
}

export type RocketInput = Pick<Rocket, 'name' | 'description'> & Partial<Pick<Rocket, 'cost_per_launch' | 'country' | 'first_flight'>>
