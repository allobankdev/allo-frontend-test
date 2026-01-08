export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  company: string;
  active: boolean;
}

export type RocketFilters = {
  search: string
  active: boolean | null
  country: string | null
  year: number | null
  costMin: number | null
  costMax: number | null
}
