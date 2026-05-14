export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number | null
  country: string
  first_flight: string
  active: boolean
  isLocal?: boolean
}
