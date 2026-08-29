import type { Rocket, SpaceXRocket } from '@/types/rocket'

const SPACE_X_ROCKETS_ENDPOINT = 'https://api.spacexdata.com/v4/rockets'
const FALLBACK_IMAGE = 'https://images2.imgbox.com/ab/79/Wyc9K7fv_o.png'

function mapRocket(rocket: SpaceXRocket): Rocket {
  return {
    id: rocket.id,
    name: rocket.name,
    description: rocket.description,
    image: rocket.flickr_images[0] || FALLBACK_IMAGE,
    costPerLaunch: rocket.cost_per_launch,
    country: rocket.country,
    firstFlight: rocket.first_flight,
    active: rocket.active,
    source: 'api',
  }
}

export async function fetchRockets(): Promise<Rocket[]> {
  const response = await fetch(SPACE_X_ROCKETS_ENDPOINT)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status}`)
  }

  const data = await response.json() as SpaceXRocket[]

  return data.map(mapRocket)
}
