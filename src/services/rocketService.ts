import type { Rocket, RocketApiResponse } from '@/types/rocket';

export const getRockets = async (): Promise<Rocket[]> => {
  const response = await fetch(
    `https://lldev.thespacedevs.com/2.2.0/config/launcher?manufacturer__name=SpaceX&mode=detailed&limit=20`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch rockets');
  }

  const data: RocketApiResponse = await response.json();

  return data.results;
};
