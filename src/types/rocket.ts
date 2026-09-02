export interface RawRocket {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | string | null
  maiden_flight: string | null
  manufacturer?: {
    country_code: string | null
  } | null
}

export interface RawRocketListResponse {
  results: RawRocket[]
}

export interface Rocket {
  id: number | string
  fullName: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  maidenFlight: string | null
  isLocal: boolean
}

export function mapRawRocket(raw: RawRocket): Rocket {
  const cost = raw.launch_cost == null ? null : Number(raw.launch_cost)

  return {
    id: raw.id,
    fullName: raw.full_name,
    description: raw.description,
    imageUrl: raw.image_url,
    launchCost: Number.isFinite(cost) ? cost : null,
    countryCode: raw.manufacturer?.country_code ?? null,
    maidenFlight: raw.maiden_flight,
    isLocal: false,
  }
}