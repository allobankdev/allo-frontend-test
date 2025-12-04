export interface Rocket {
  id: string;
  name: string;
  description: string;
  cost_per_launch: number;
  country: string;
  first_flight: string;
  flickr_images: string[];
  active: boolean;
}

export interface NewRocket {
  id?: string;
  name: string;
  description: string;
  cost_per_launch: number;
  country: string;
  first_flight: string;
  image_url: string;
}

export interface RocketState {
  rockets: Rocket[];
  filteredRockets: Rocket[];
  loading: boolean;
  error: string | null;
  filter: string;
  pagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
}

export interface PaginationResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}