export interface CreateRocketPayload {
  name: string
  country: string | null
  cost_per_launch: number | null
  first_flight: string
  description: string
  image?: string
}
