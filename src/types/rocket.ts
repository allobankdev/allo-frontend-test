export interface Manufacturer {
  id?: number;
  url?: string;
  name?: string;
  country_code?: string;
  country?: string | string[];
  type?: string;
}

export interface Rocket {
  id: number | string;
  name: string;
  full_name: string;
  description?: string | null;
  image_url?: string | null;
  launch_cost?: string | number | null;
  maiden_flight?: string | null;
  manufacturer?: Manufacturer | null;
  active?: boolean;
  reusable?: boolean;
  length?: number | null;
  diameter?: number | null;
  launch_mass?: number | null;
  leo_capacity?: number | null;
  gto_capacity?: number | null;
  successful_launches?: number | null;
  failed_launches?: number | null;
  total_launch_count?: number | null;
  wiki_url?: string | null;
  info_url?: string | null;
  is_custom?: boolean;
}

export interface RocketApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
