export interface Rocket {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  launchCost: string | null;
  country: string | null;
  firstFlight: string | null;
  isCustom?: boolean;
}

export interface LauncherApiResponse {
  results: LauncherApiItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface LauncherApiItem {
  id: number;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer: {
    country_code: string | null;
  } | null;
}
