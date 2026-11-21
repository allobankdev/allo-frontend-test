export interface Rocket {
  id: string;
  name: string;
  image: string | null;
  description: string;
  costPerLaunch: number | null;
  country: string | null;
  firstFlight: string | null;
  isLocal?: boolean;
}

export interface RocketApi {
  id: number | string;
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
  launch_cost?: number | null;
  maiden_flight?: string | null;
  manufacturer?: {
    name?: string | null;
    country_code?: string | null;
  } | null;
}

export interface RocketListResponse {
  count: number;
  results: RocketApi[];
}