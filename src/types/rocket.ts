/** Raw shape from the Launch Library 2 API — always normalize via toRocket() before use in the UI. */
export interface LauncherDto {
  id: number
  full_name: string
  description: string | null
  launch_cost: string | null
  maiden_flight: string | null
  image_url: string | null
  manufacturer: { country_code: string | null } | null
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  costPerLaunch: number | null
  country: string | null
  firstFlight: string | null
  isLocal?: boolean
}

/** Only `name` is required — other fields may be empty, mirroring the real API data. */
export interface NewRocketInput {
  name: string
  description?: string | null
  imageUrl?: string | null
  costPerLaunch?: number | null
  country?: string | null
  firstFlight?: string | null
}
