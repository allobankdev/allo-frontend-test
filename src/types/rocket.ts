export interface Manufacturer {
  id: number;
  name: string;
  country_code: string | null;
}

export interface Rocket {
  id: number | string;
  name: string;
  full_name: string;
  description: string | null;
  image_url: string | null;
  manufacturer: Manufacturer;
  maiden_flight: string | null;
  launch_cost: string | null;
  isLocal?: boolean;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}

export interface NewRocketInput {
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  country_code: string | null;
}
