/**
 * src/features/rockets/api/rocket.rest.ts
 *
 * REST API Client
 */

import { ofetch } from 'ofetch';

/**
 * DTO 2.2.0
 *
 * Note that some rockets have missing values for launch_cost, maiden_flight, and image_url.
 */
export interface RocketRestDto {
  id: number;
  image_url: string | null;
  full_name: string;
  description: string;
  launch_cost: string | null;
  manufacturer: {
    country_code: string;
  };
  maiden_flight: string | null;
}

export interface RocketRestListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: RocketRestDto[];
}

/**
 * Launch Library 2 API by The Space Devs for rocket data
 *
 * Documentation: https://thespacedevs.com/llapi
 */
const apiURL = import.meta.env.DEV ? 'https://lldev.thespacedevs.com' : 'https://ll.thespacedevs.com'
const apiVersion = '2.2.0';

/**
 * HTTP client wrapper
 *
 * Documentation: https://github.com/unjs/ofetch
 */
const client = ofetch.create({
  baseURL: `${apiURL}/${apiVersion}`,
  timeout: 10_000
});

/**
 * Fetch all SpaceX rockets
 */
export const fetchRockets = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;

  return await client<RocketRestListResponseDto>('/config/launcher/', {
    params: {
      manufacturer__name: 'SpaceX',
      mode: 'detailed', // is required — without it the response omits description and the other detail fields
      limit,
      offset,
    },
  });
};

/**
 * Fetch a single rocket by ID.
 */
export const fetchRocketById = async (id: number) => {
  return await client<RocketRestDto>(`/config/launcher/${id}/`);
};
