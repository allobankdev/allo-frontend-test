
export interface Rocket {
  id: number | string;

  full_name: string;

  description: string | null;

  image_url: string | null;

  launch_cost: number | null;

  maiden_flight: string | null;

  manufacturer?: {
    name?: string;
    country_code?: string | null;
  } | null;
}

export interface RocketApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
