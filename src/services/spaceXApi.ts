import type { IDataRocket } from '@/types/rocket';

const API_URL = 'https://api.spacexdata.com/v4/rockets';

export async function fetchRockets(): Promise<IDataRocket[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch rockets');
  return res.json();
}

export async function fetchRocketById(id: string): Promise<IDataRocket> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch rocket');
  return res.json();
}

