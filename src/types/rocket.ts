export type Rocket = {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null

  manufacturer?: {
    country_code?: string | null
  }
  isLocal?: boolean
}