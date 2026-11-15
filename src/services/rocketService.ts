import type { Rocket, RocketApiResponse } from '@/types/rocket';

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0';

export async function getRockets(): Promise<Rocket[]> {
  const url = new URL(
    `${API_BASE_URL}/config/launcher/`
  );

  url.searchParams.set('manufacturer__name', 'SpaceX');
  url.searchParams.set('mode', 'detailed');
  url.searchParams.set('limit', '20');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Gagal mengambil data roket: ${response.status}`);
  }

  const data: RocketApiResponse = await response.json();

  return data.results;
}

export async function getRocketById(
  id: number | string
): Promise<Rocket> {
  const response = await fetch(
    `${API_BASE_URL}/config/launcher/${id}/`
  );

  if (!response.ok) {
    throw new Error(`Gagal mengambil detail roket: ${response.status}`);
  }

  return response.json();
}
