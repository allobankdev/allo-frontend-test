export interface IRocket {
  id: string
  name: string
  description: string
  country: string
  first_flight: string
  cost_per_launch: number
  flickr_images: string[]
  active: boolean

  height: { meters: number }
  mass: { kg: number }
  engines: { number: number; type: string }
  success_rate_pct: number

  payload_weights: {
    id: string
    name: string
    kg: number
  }[]
}
