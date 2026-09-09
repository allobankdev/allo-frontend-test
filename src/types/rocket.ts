export interface Rocket {
  id: number
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: {
    name: string | null
    country_code: string | null
  } | null
}