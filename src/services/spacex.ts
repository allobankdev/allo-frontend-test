import type { SpacexRocket } from '@/types/rocket'

const BASE_URL = 'https://api.spacexdata.com/v4'

export async function fetchRockets (opts?: { signal?: AbortSignal }): Promise<SpacexRocket[]> {
  const res = await fetch(`${BASE_URL}/rockets`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: opts?.signal,
  })

  if (!res.ok) {
    // Keep error message readable for UI
    throw new Error(`Failed to fetch rockets (HTTP ${res.status})`)
  }

  return res.json() as Promise<SpacexRocket[]>
}
