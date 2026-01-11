export interface RocketListDTO {
  id: string
  name: string
  active: boolean
  stages: number
  boosters: number
  cost_per_launch: number
  first_flight: string
  description: string
  flickr_images: string[]
}
