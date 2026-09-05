export interface Rocket {
  id: number
  name: string
  fullName: string
  description: string
  imageUrl: string | null
  costPerLaunch: number | null
  country: string | null
  firstFlight: string | null
}

interface ApiRocket {
  id: number
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: { country_code: string | null } | null
}

interface ApiResponse {
  results: ApiRocket[]
}

const API_URL = import.meta.env.VITE_ROCKET_API_URL

export async function fetchRockets (): Promise<Rocket[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch rockets (HTTP ${res.status})`)
  }
  const data: ApiResponse = await res.json()
  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? '',
    imageUrl: r.image_url || null,
    costPerLaunch: r.launch_cost ?? null,
    country: r.manufacturer?.country_code ?? null,
    firstFlight: r.maiden_flight ?? null,
  }))
}