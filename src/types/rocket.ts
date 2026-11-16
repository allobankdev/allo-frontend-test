
export interface Rocket {
  id: number;
  image_url: string | null;
  full_name: string;
  description: string | null;
  launch_cost: string | number | null;
  manufacturer: {
    country_code: string | null;
  } | null;
  maiden_flight: string | null;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
