export interface Rocket {
  id: string
  name: string
  description: string
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  firstFlight: string | null
}

export type NewRocket = Omit<Rocket, 'id'>
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
