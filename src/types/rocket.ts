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
  manufacturer: Manufacturer | null;
}

export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}

export type FlightStatusFilter = "all" | "flown" | "not_flown";
export type CostStatusFilter = "all" | "has_cost" | "no_cost";
