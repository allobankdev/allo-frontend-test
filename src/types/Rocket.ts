export interface Rocket {
  id: string,
  images: string[]
  name: string
  description: string
  cost: number | null,
  country: string | null,
  firstFlight: Date,
}
