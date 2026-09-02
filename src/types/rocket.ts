export interface RocketManufacturer {
  name: string
  country_code: string
}

/** Matches the Launch Library 2 API v2.2.0 `/config/launcher/` response shape. */
export interface Rocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  /** Marks rockets that were added locally by the user (not from the API). */
  isLocal?: boolean
}

export interface RocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}

/** Shape of the form used when a user adds a new rocket locally. */
export interface NewRocketForm {
  full_name: string
  description: string
  image_url: string
}

