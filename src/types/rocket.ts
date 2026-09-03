export interface RawRocketManufacturer {
  country_code: string | null
}

export interface RawRocket {
  id: number
  full_name: string
  description: string | null
  family: string | null
  active: boolean
  reusable: boolean
  image_url: string | null
  launch_cost: number | string | null
  maiden_flight: string | null
  manufacturer?: RawRocketManufacturer | null
}

export interface RawRocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: RawRocket[]
}

export interface Rocket {
  id: number
  fullName: string
  description: string | null
  family: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  maidenFlight: string | null
  active: boolean
  reusable: boolean
  isLocal: boolean
}

function parseLaunchCost(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function mapRawRocket(raw: RawRocket): Rocket {
  return {
    id: raw.id,
    fullName: raw.full_name,
    description: raw.description ?? null,
    family: raw.family ?? null,
    imageUrl: raw.image_url ?? null,
    launchCost: parseLaunchCost(raw.launch_cost),
    countryCode: raw.manufacturer?.country_code ?? null,
    maidenFlight: raw.maiden_flight ?? null,
    active: raw.active,
    reusable: raw.reusable,
    isLocal: false,
  }
}