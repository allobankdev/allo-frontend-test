export interface RocketManufacturer {
  country_code: string;
}

export interface Rocket {
  id: number | string;
  url: string;
  name: string;
  full_name: string;
  description: string;
  launch_cost: string | null;
  maiden_flight: string | null;
  image_url: string | null;
  manufacturer?: RocketManufacturer;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
