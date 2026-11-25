/**
 * Fungsi: Khusus buat ngambil data dari Launch Library 2.2.0 API (lldev.thespacedevs.com).
 *         Isinya fetchRockets (ambil semua roket SpaceX) sama fetchRocketById (ambil detail
 *         1 roket), udah support AbortSignal biar request otomatis batal kalau pindah halaman.
 * Dipakai di:
 *  - src/stores/rocketStore.ts (fetchRockets)
 *  - src/pages/rockets/[id].vue (fetchRocketById)
 */

import { mapRawRocket, type RawRocket, type Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

interface RocketListResponse {
  results: RawRocket[]
}

export async function fetchRockets(signal?: AbortSignal): Promise<Rocket[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const res = await fetch(url, { signal })

  if (!res.ok) {
    throw new Error(`Failed to load rockets (HTTP ${res.status})`)
  }

  const data: RocketListResponse = await res.json()
  return (data.results ?? []).map(mapRawRocket)
}

export async function fetchRocketById(
  id: string,
  signal?: AbortSignal,
): Promise<Rocket> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/`, { signal })

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? 'Rocket not found.'
        : `Failed to load rocket details (HTTP ${res.status})`,
    )
  }

  const data: RawRocket = await res.json()
  return mapRawRocket(data)
}