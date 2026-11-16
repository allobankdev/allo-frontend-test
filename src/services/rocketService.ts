
import type { Rocket, RocketListResponse } from '@/types/rocket';

const API_URL = 'https://lldev.thespacedevs.com/2.2.0';

const ROCKET_LIST_URL =
  `${API_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`;

// Mengambil seluruh daftar roket SpaceX
export async function getRockets(): Promise<Rocket[]> {
  const response = await fetch(ROCKET_LIST_URL);

  if (!response.ok) {
    throw new Error('Gagal mengambil daftar roket');
  }

  const data: RocketListResponse = await response.json();

  return data.results;
}

// Mengambil detail roket berdasarkan ID
export async function getRocketById(id: string | number): Promise<Rocket> {
  const response = await fetch(
    `${API_URL}/config/launcher/${id}/?mode=detailed`
  );

  if (!response.ok) {
    throw new Error('Gagal mengambil detail roket');
  }

  const data: Rocket = await response.json();

  return data;
}
