export interface RocketApiItem {
  id: number;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer: {
    country_code: string | null;
  };
}

export interface RocketApiListResponse {
  count: number;
  results: RocketApiItem[];
}

export interface Rocket {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  costPerLaunch: string | null;
  country: string | null;
  firstFlight: string | null;
}

export function mapRocketApiItemToRocket(item: RocketApiItem): Rocket {
  return {
    id: item.id,
    name: item.full_name,
    description: item.description ?? null,
    imageUrl: item.image_url ?? null,
    costPerLaunch: item.launch_cost ?? null,
    country: item.manufacturer?.country_code ?? null,
    firstFlight: item.maiden_flight ?? null,
  };
}
