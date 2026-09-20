import type { Rocket, RocketListResponse } from '../types/rocket';

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0';

export async function fetchRocketList(): Promise<Rocket[]> {
  const response = await fetch(
    `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data: RocketListResponse = await response.json();
  return data.results;
}
