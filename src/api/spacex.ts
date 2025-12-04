import type { Rocket } from "@/types/rocket";

const API_URL = 'https://api.spacexdata.com/v4';

export const fetchRockets = async (queryParams = {}): Promise<Rocket[] | any> => {
  try {
    let url = `${API_URL}/rockets`;
    let options: RequestInit = {
      method: 'GET'
    };

    if (Object.keys(queryParams).length > 0) {
      url = `${API_URL}/rockets/query`;
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryParams)
      };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error fetching rockets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch rockets:', error);
    throw error;
  }
};

export const fetchRocketById = async (id: string): Promise<Rocket> => {
  try {
    const response = await fetch(`${API_URL}/rockets/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching rocket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch rocket with ID ${id}:`, error);
    throw error;
  }
};