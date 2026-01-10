export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  wikipedia: string;
  description: string;
  flickr_images: string[];
}

export interface FilterOptions {
  active: boolean | null;
  country: string;
  successRate: number;
}

export interface NewRocketData {
  name: string;
  description: string;
  country: string;
  cost_per_launch: number;
  flickr_images: string[];
}