export interface Rocket {
  id: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  costPerLaunch: string | null;
  country: string | null;
  firstFlight: string | null;
  isLocal: boolean;
}

export interface RawListResponse {
  results: RawRocket[];
}

export interface RawRocket {
  id: number;
  full_name?: string;
  name?: string;
  description?: string;
  image_url?: string;
  launch_cost?: string;
  maiden_flight?: string;
  manufacturer?: { country_code?: string };
}
