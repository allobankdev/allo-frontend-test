/**
 * rocketApi.ts
 *
 * Thin API client for Launch Library 2 API v2.2.0.
 * Uses the dev host (lldev.thespacedevs.com) which has a much higher rate
 * limit than the production host — safe for development.
 */

import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

/**
 * Fetch all SpaceX launchers in a single request.
 * manufacturer__name=SpaceX + mode=detailed + limit=20 ensures we get all 13
 * rockets with their full description fields in one go.
 */
export async function fetchRockets(): Promise<Rocket[]> {
  const url =
    `${BASE_URL}/config/launcher/` +
    `?manufacturer__name=SpaceX&mode=detailed&limit=20`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (HTTP ${response.status})`)
  }

  const data: RocketListResponse = await response.json()
  return data.results
}

/**
 * Fetch a single launcher by id.
 * mode=detailed is required to include description and other extended fields.
 */
export async function fetchRocketById(id: number): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/?mode=detailed`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rocket ${id} (HTTP ${response.status})`
    )
  }

  return response.json()
}
