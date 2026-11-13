import type { Rocket } from '@/types/rocket'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://lldev.thespacedevs.com/2.2.0'

export async function fetchRockets(signal?: AbortSignal): Promise<Rocket[]> {
  const res = await fetch(`${BASE}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`, { signal })
  if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`)
  return (await res.json()).results
}

export async function fetchRocketById(id: string, signal?: AbortSignal): Promise<Rocket> {
  const res = await fetch(`${BASE}/config/launcher/${id}/?mode=detailed`, { signal })
  if (!res.ok) throw new Error(`Gagal memuat detail (${res.status})`)
  return res.json()
}