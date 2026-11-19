import { Rocket, LauncherApiResponse } from '../types/rocket';

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher';

/**
 * Fetch list of SpaceX rockets using LL2 v2.2.0 API.
 * Mode detailed and limit=20 are required to fetch all records with full attributes.
 */
export async function fetchRockets(): Promise<Rocket[]> {
  const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch rockets (HTTP ${response.status})`);
  }

  const data: LauncherApiResponse = await response.json();
  return data.results || [];
}

/**
 * Fetch a single rocket configuration by ID using LL2 v2.2.0 API.
 */
export async function fetchRocketById(id: string | number): Promise<Rocket> {
  const url = `${BASE_URL}/${id}/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch rocket #${id} (HTTP ${response.status})`);
  }

  const data: Rocket = await response.json();
  return data;
}

