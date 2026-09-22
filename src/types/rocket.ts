export interface Rocket {
  id: number | string;
  imageUrl: string | null;
  name: string;
  description: string | null;
  launchCost: number | null;
  country: string | null;
  maidenFlight: string | null;
  isLocal?: boolean;
}

export interface LauncherApiResponse {
  id: number;
  image_url?: string | null;
  full_name?: string | null;
  description?: string | null;
  launch_cost?: number | null;
  maiden_flight?: string | null;
  manufacturer?: {
    country_code?: string | null;
  } | null;
}

export interface RocketForm {
  name: string;
  description: string;
  imageUrl: string;
  launchCost: string;
  country: string;
  maidenFlight: string;
}
