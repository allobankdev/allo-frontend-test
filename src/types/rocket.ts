export interface RocketManufacturer {
  name?: string | null;
  country_code?: string | null;
}

export interface Rocket {
  id: number | string;
  image_url: string | null;
  full_name: string;
  description: string | null;
  launch_cost: number | null;
  manufacturer: RocketManufacturer | null;
  maiden_flight: string | null;
}

export interface RocketApiResponse {
  results: Rocket[];
  next: string | null;
  count: number;
}
