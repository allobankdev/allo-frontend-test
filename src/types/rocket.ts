export interface Rocket {
  id: string
  name: string
  type: string
  active: boolean
  country: string
  company: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  first_flight: string
  success_rate_pct: number
}
