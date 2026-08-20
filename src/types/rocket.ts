export interface Rocket {
  id: string | number
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: string | number | null
  country: string | null
  maidenFlight: string | null
  isLocal: boolean
}

export interface NewRocketInput {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  maidenFlight: string
}
