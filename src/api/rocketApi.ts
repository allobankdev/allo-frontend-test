// ============================================================
// Launch Library 2 API Client — v2.2.0
// Docs: https://thespacedevs.com/llapi
// Dev host (generous rate limit): lldev.thespacedevs.com
// ============================================================

import type { Rocket, RocketApiResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

/**
 * Fetch all SpaceX rockets (13 total) in one request.
 * mode=detailed is required to get description and extra fields.
 * limit=20 ensures we get all 13 (default is 10).
 */
export async function fetchRockets(): Promise<RocketApiResponse> {
  const url = new URL(`${BASE_URL}/config/launcher/`)
  url.searchParams.set('manufacturer__name', 'SpaceX')
  url.searchParams.set('mode', 'detailed')
  url.searchParams.set('limit', '20')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Gagal memuat data: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<RocketApiResponse>
}

/**
 * Fetch a single rocket by numeric ID.
 * mode=detailed is required to get description, launch_cost, etc.
 */
export async function fetchRocketById(id: number): Promise<Rocket> {
  const url = new URL(`${BASE_URL}/config/launcher/${id}/`)
  url.searchParams.set('mode', 'detailed')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Gagal memuat detail roket (${id}): ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<Rocket>
}
