/**
 * Fungsi: Menyimpan tipe data roket (sesuai response Launch Library 2.2.0), mapper buat
 *         ngubah data mentah API ke format aplikasi, dan helper buat format harga,
 *         tanggal, dan cek URL biar aman kalau ada field yang null/kosong.
 * Dipakai di:
 *  - src/services/rocketsApi.ts (mapRawRocket, RawRocket, Rocket)
 *  - src/stores/rocketStore.ts (Rocket, NewRocketInput)
 *  - src/components/RocketCard.vue (Rocket)
 *  - src/components/AddRocketDialog.vue (NewRocketInput, isValidHttpUrl)
 *  - src/pages/rockets/[id].vue (Rocket, formatCurrency, formatDate)
 */
export interface RawRocket {
  id: number
  full_name?: string | null
  name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: number | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string | null
  } | null
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  firstFlight: string | null
  isLocal?: boolean
}

export type NewRocketInput = Omit<Rocket, 'id' | 'isLocal'>

export function mapRawRocket(raw: RawRocket): Rocket {
  return {
    id: String(raw.id),
    name: raw.full_name?.trim() || raw.name?.trim() || 'Unnamed Rocket',
    description: raw.description?.trim() || null,
    imageUrl: raw.image_url?.trim() || null,
    launchCost: typeof raw.launch_cost === 'number' ? raw.launch_cost : null,
    countryCode: raw.manufacturer?.country_code?.trim() || null,
    firstFlight: raw.maiden_flight?.trim() || null,
  }
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) return 'Not disclosed'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) return 'Unknown'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}