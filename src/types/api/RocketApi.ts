export interface Length {
  meters: number
  feet: number
}

export interface Mass {
  kg: number
  lb: number
}

export interface RocketApi {
  id: string
  name: string
  type: string
  active: boolean

  height: Length
  diameter: Length
  mass: Mass

  stages: number
  boosters: number
  cost_per_launch: number | null
  success_rate_pct: number
  first_flight: string

  country: string | null
  company: string
  wikipedia: string
  description: string

  flickr_images: string[]

  first_stage: Record<string, unknown>
  second_stage: Record<string, unknown>
  engines: Record<string, unknown>
  landing_legs: Record<string, unknown>
  payload_weights: unknown[]
}
