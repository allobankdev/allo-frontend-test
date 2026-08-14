import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface RocketResponse {
  results: Rocket[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface Rocket {
  id: number | string;
  full_name: string;
  description: string;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer: {
    country_code: string;
  };
}

export const fetchRocketsApi = async (): Promise<RocketResponse> => {
  const response = await api.get('', {
    params: {
      manufacturer__name: 'SpaceX',
      mode: 'detailed',
      limit: 20
    }
  });
  return response.data;
};

export const fetchRocketByIdApi = async (id: string | number): Promise<Rocket> => {
  const response = await api.get(`${id}/`, {
    params: {
      mode: 'detailed'
    }
  });
  return response.data;
};
