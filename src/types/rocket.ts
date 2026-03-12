export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active: boolean
  height: { meters: number; feet: number }
  diameter: { meters: number; feet: number }
  mass: { kg: number; lb: number }
  stages: number
  wikipedia: string
}
