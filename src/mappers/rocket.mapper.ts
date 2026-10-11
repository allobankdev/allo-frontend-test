import type {RocketApi} from '@/types/api/RocketApi'
import type {Rocket} from '@/types/Rocket'

export function mapRocketApiToRocket(api: RocketApi): Rocket {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    images: api.flickr_images,
    cost: api.cost_per_launch,
    firstFlight: new Date(api.first_flight),
    country: api.country,
  }
}

export function mapRocketApiList(data: RocketApi[]): Rocket[] {
  return data.map(mapRocketApiToRocket)
}

export function mapRocketApiDetail(data: RocketApi): Rocket {
  return mapRocketApiToRocket(data)
}
