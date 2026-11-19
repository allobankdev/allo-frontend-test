import type { Rocket, RocketApiResponse } from '@/types/rocket';

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher';

/**
 * Fetches the SpaceX rocket list.
 * Parameters: manufacturer__name=SpaceX, mode=detailed, limit=20
 */
export async function getSpaceXRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API Rate Limit exceeded (15 req/hour limit). Please wait a moment and retry.');
    }
    throw new Error(`Failed to fetch SpaceX rockets (HTTP ${response.status}: ${response.statusText})`);
  }

  const data: RocketApiResponse = await response.json();
  return data.results || [];
}

/**
 * Fetches details for a single rocket by ID.
 */
export async function getRocketById(id: string | number): Promise<Rocket> {
  const url = `${BASE_URL}/${id}/?mode=detailed`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API Rate Limit exceeded. Please wait a moment and retry.');
    }
    throw new Error(`Failed to fetch rocket detail (HTTP ${response.status}: ${response.statusText})`);
  }

  const rocket: Rocket = await response.json();
  return rocket;
}
