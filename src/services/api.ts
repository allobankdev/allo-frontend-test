import axios from 'axios';

const BASE_URL = 'https://api.spacexdata.com/v4';

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  height: { meters: number; feet: number };
  diameter: { meters: number; feet: number };
  mass: { kg: number; lb: number };
}

export const fetchRockets = async (): Promise<Rocket[]> => {
  const response = await axios.get(`${BASE_URL}/rockets`);
  return response.data;
};

export const fetchRocketById = async (id: string): Promise<Rocket> => {
  const response = await axios.get(`${BASE_URL}/rockets/${id}`);
  return response.data;
};
