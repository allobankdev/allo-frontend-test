export interface Rocket {
  id: string;
  name: string;
  description: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  wikipedia: string;
  flickr_images: string[];
  height: {
    meters: number;
    feet: number;
  };
  diameter: {
    meters: number;
    feet: number;
  };
  mass: {
    kg: number;
    lb: number;
  };
  type: string;
}

export interface FilterState {
  searchQuery: string;
  activeStatus: "all" | "active" | "inactive";
  sortBy: "name" | "cost" | "date";
}

export interface RocketState {
  rockets: Rocket[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
}
