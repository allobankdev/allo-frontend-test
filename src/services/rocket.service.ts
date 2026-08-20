import type { LauncherApiResponse, LauncherConfigApi } from '@/types/rocket-api'
import type { Rocket } from '@/types/rocket'
import { mapApiRocket } from '@/mappers/rocket.mapper'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

async function apiFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`API error ${response.status} (${response.statusText}) — ${url}`)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error(`Failed to parse API response from ${url}`)
  }
}

export async function fetchRocketList(signal?: AbortSignal): Promise<Rocket[]> {
  const data = await apiFetch<LauncherApiResponse>(
    '/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20',
    signal,
  )
  if (!Array.isArray(data?.results)) {
    throw new Error('Unexpected API response shape: missing results array')
  }
  return data.results.map(mapApiRocket)
}

export async function fetchRocketById(id: string | number, signal?: AbortSignal): Promise<Rocket> {
  const raw = await apiFetch<LauncherConfigApi>(`/config/launcher/${id}/?mode=detailed`, signal)
  return mapApiRocket(raw)
}
