import type { Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

/** Bentuk respons mentah API 2.2.0 (hanya field yang dipakai). */
interface LauncherDto {
  id: number
  full_name?: string | null
  name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: { country_code?: string | null } | null
}

interface LauncherListDto {
  results: LauncherDto[]
}

/** Mapper DTO -> domain model. Semua normalisasi data kosong dipusatkan di sini. */
function toRocket (dto: LauncherDto): Rocket {
  const cost = dto.launch_cost != null && dto.launch_cost !== '' ? Number(dto.launch_cost) : NaN
  return {
    id: String(dto.id),
    name: dto.full_name || dto.name || 'Unnamed rocket',
    description: dto.description?.trim() || null,
    imageUrl: dto.image_url || null,
    launchCost: Number.isFinite(cost) ? cost : null,
    countryCode: dto.manufacturer?.country_code || null,
    maidenFlight: dto.maiden_flight || null,
  }
}

async function getJson<T> (url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : `Request failed (HTTP ${res.status}).`,
    )
  }
  return res.json() as Promise<T>
}

export async function fetchRockets (): Promise<Rocket[]> {
  const query = new URLSearchParams({ manufacturer__name: 'SpaceX', mode: 'detailed', limit: '20' })
  const data = await getJson<LauncherListDto>(`${BASE_URL}/?${query}`)
  return data.results.map(toRocket)
}

export async function fetchRocketById (id: string): Promise<Rocket> {
  const data = await getJson<LauncherDto>(`${BASE_URL}/${encodeURIComponent(id)}/?mode=detailed`)
  return toRocket(data)
}
