/** Rocket as used by the UI. Missing values are '' (text) or null (cost). */
export interface Rocket {
  id: string
  name: string
  description: string
  imageUrl: string
  launchCost: number | string | null
  country: string
  maidenFlight: string
  isLocal: boolean
}

/** Values entered in the "Add rocket" form. */
export interface NewRocketInput {
  name: string
  description: string
  imageUrl: string
  launchCost: number | ''
  country: string
  maidenFlight: string
}

/** The fields we read from the Launch Library 2 (v2.2.0) launcher config. Any of them may be missing. */
export interface RocketDto {
  id: number | string
  name?: string | null
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: number | string | null
  maiden_flight?: string | null
  manufacturer?: { country_code?: string | null } | null
}

export interface RocketListDto {
  results: RocketDto[]
}
