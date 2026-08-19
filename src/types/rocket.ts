export interface Ll2Rocket {
  id: number | string
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  manufacturer?: { country_code?: string | null } | null
  maiden_flight?: string | null
}

export interface Ll2RocketList {
  count: number
  results: Ll2Rocket[]
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  countryCode: string | null
  maidenFlight: string | null
  isLocal: boolean
}

export interface LocalRocketInput {
  name: string
  description?: string
  imageUrl?: string
  launchCost?: string
  countryCode?: string
  maidenFlight?: string
}
