import { requestJson } from './api'
import type { Rocket } from '@/types/rocket'

interface SpaceXRocketResponse {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

function normalizeRocket(data: SpaceXRocketResponse): Rocket {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.flickr_images[0] ?? null,
    images: data.flickr_images ?? [],
    costPerLaunch: data.cost_per_launch,
    country: data.country,
    firstFlight: data.first_flight,
  }
}

export async function getRockets(): Promise<Rocket[]> {
  const rockets = await requestJson<SpaceXRocketResponse[]>('/rockets')
  return rockets.map(normalizeRocket)
}
