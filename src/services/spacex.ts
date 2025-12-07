export interface RocketApiResponse {
    id: string;
    name: string;
    description: string;
    flickr_images: string[];
    country: string;
    cost_per_launch: number;
    first_flight: string;
  }
  
  const BASE_URL = 'https://api.spacexdata.com/v4';
  
  export async function getAllRockets(): Promise<RocketApiResponse[]> {
    const res = await fetch(`${BASE_URL}/rockets`);
    if (!res.ok) {
      throw new Error('Failed to fetch rockets');
    }
    return res.json();
  }
  
  export async function getRocketById(id: string): Promise<RocketApiResponse> {
    const res = await fetch(`${BASE_URL}/rockets/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch rocket detail');
    }
    return res.json();
  }
  