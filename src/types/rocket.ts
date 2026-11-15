export interface Rocket {
  id: string
  name: string
  description: string
  imageUrl: string | null
  cost: string | null
  country: string | null
  firstFlight: string | null
  family: string | null
  local?: boolean
}

export type NewRocket = Omit<Rocket, 'id' | 'local'>
