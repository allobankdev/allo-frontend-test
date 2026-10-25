/**
 * Shape data rocket dari Launch Library 2 API (mode=detailed).
 * Hampir semua field nullable — fallback ditangani di utils/formatters.ts.
 */
export interface Rocket {
  id: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    country_code: string | null
  } | null
  /** true jika rocket ditambahkan manual via form (lokal, bukan dari API) */
  isLocal?: boolean
}

/** Field yang bisa diisi user pada form "Tambah Roket" */
export interface NewRocketPayload {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  maiden_flight: string
  country_code: string
}
