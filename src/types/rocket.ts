export interface Rocket {
  id: string | number
  name: string
  description: string
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  maidenFlight: string | null
  isCustom?: boolean
}

export interface NewRocketInput {
  name: string
  description: string
  imageUrl?: string
  launchCost?: string
  country?: string
  maidenFlight?: string
}
