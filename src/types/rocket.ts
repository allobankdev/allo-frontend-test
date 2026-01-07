export interface Rocket {
  id: string;
  name: string;
  description: string;
  active: boolean;
  cost_per_launch: number;
  first_flight: string;
  country: string;
  flickr_images: string[];
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
