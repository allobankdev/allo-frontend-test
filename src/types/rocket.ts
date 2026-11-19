export interface Manufacturer {
  id?: number;
  name?: string;
  country_code: string | null;
}

export interface Rocket {
  id: number | string;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: number | string | null;
  maiden_flight: string | null;
  manufacturer?: Manufacturer | null;
  isLocal?: boolean;
}

export interface LauncherApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}

export type Status = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

