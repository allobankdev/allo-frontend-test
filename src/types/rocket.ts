export interface LauncherResponse {
  id: number;
  image_url?: string | null;
  full_name?: string | null;
  description?: string | null;
  launch_cost?: string | number | null;
  manufacturer?: { country_code?: string | null } | null;
  maiden_flight?: string | null;
}

export interface LauncherListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LauncherResponse[];
}

export interface Rocket {
  id: string;
  source: "api" | "local";
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  launchCost: string | number | null;
  country: string | null;
  firstFlight: string | null;
}

export type NewRocket = Omit<Rocket, "id" | "source">;
