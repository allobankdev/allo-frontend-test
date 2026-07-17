/**
 * The subset of the SpaceX v4 rocket shape this app consumes.
 * See https://github.com/r-spacex/SpaceX-API (GET /v4/rockets).
 */
export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active: boolean
}

/** Fields a user provides when adding a rocket locally. */
export interface NewRocketInput {
  name: string
  description: string
  imageUrl: string
  cost_per_launch: number
  country: string
  first_flight: string
}
