export interface Manufacturer {
  id?: number;
  url?: string;
  name?: string;
  country_code?: string;
}

export interface Rocket {
  id: number | string;
  url?: string;
  name?: string;
  full_name: string;
  description?: string | null;
  family?: string | null;
  variant?: string | null;
  maiden_flight?: string | null;
  launch_cost?: string | number | null;
  image_url?: string | null;
  manufacturer?: Manufacturer | null;
  is_custom?: boolean;
}

export interface RocketListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Rocket[];
}
