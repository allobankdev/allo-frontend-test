export interface Manufacturer {
  country_code: string;
}

export interface Rocket {
  id: number;
  full_name: string;
  description: string;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null; // ISO date string e.g. "2010-06-04"
  manufacturer: Manufacturer;
}

/** Shape of the paginated list response from the API */
export interface RocketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
