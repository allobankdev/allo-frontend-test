/**
 * services/rocketApi.ts
 *
 * API service for interacting with Launch Library 2 API v2.2.0
 */

import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

/**
 * Fetch all SpaceX rockets (up to 20, which covers all 13)
 */
export async function fetchRockets(): Promise<RocketListResponse> {
  const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<RocketListResponse>
}

/**
 * Fetch a single rocket by ID
 */
export async function fetchRocketById(id: number): Promise<Rocket> {
  const url = `${BASE_URL}/config/launcher/${id}/?mode=detailed`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch rocket ${id}: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<Rocket>
}

