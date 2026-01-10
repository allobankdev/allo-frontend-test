export interface RocketQueryFilter {
  name?: {
    $regex: string;
    $options: string;
  };
  active?: boolean;
  country?: string;
}

export interface RocketQueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface RocketQueryBody {
  query?: RocketQueryFilter;
  options?: RocketQueryOptions;
}
