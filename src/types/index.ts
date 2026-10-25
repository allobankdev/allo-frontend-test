export type RocketData = {
  id?: number;
  image_url?: string;
  full_name: string;
  description: string;
  launch_cost?: string;
  manufacturer?: {
    country_code: string;
  };
  maiden_flight?: string;
};

export type RocketResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RocketData[];
};
