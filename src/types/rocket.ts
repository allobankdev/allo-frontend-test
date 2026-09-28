export interface Rocket {
  id: string
  name: string
  description: string
  image: string
  costPerLaunch: number | null
  country: string
  firstFlight: string | null
}

// Shape returned by https://lldev.thespacedevs.com/2.2.0/config/launcher/?mode=detailed
// (Launch Library 2 by The Space Devs — see https://thespacedevs.com/llapi)
//
// Pinned to API version 2.2.0 per the assignment README: 2.3.0 renames this
// endpoint and moves several fields into nested objects (image_url becomes
// image.image_url, manufacturer.country_code becomes a manufacturer.country
// array). Both versions return the same 13 SpaceX rockets.
export interface LauncherConfigDto {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer: {
    country_code: string
  } | null
}

export interface LauncherConfigListResponse {
  count: number
  next: string | null
  previous: string | null
  results: LauncherConfigDto[]
}

export type NewRocketInput = Omit<Rocket, 'id'>

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
