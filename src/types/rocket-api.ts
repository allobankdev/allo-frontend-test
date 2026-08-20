/**
 * Types for Launch Library 2 API version 2.2.0 responses.
 */

export interface ManufacturerApi {
  id: number
  name: string
  country_code: string | null
}

export interface LauncherConfigApi {
  id: number
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: ManufacturerApi | null
}

export interface LauncherApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: LauncherConfigApi[]
}
