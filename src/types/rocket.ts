export interface Manufacturer {
  id: number;
  name: string;
  country_code: string | null;
}

export interface Rocket {
  id: number;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer: Manufacturer;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
