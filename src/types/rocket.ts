export interface Rocket {
  id: number
  fullName: string
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  maidenFlight: string | null
  source: 'api' | 'local'
}

export interface NewRocketInput {
  fullName: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  maidenFlight: string
}
