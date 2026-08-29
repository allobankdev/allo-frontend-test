export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
}

const BASE_URL = "https://api.spacexdata.com/v4";

interface RocketQueryResponse {
  docs: Rocket[];
}

interface FetchRocketsParams {
  search?: string;
}

export async function fetchRockets(
  params?: FetchRocketsParams
): Promise<Rocket[]> {
  const search = params?.search?.trim();

  const body = {
    query: search
      ? {
          name: {
            $regex: search,
            $options: "i",
          },
        }
      : {},
    options: {},
  };

  const response = await fetch(`${BASE_URL}/rockets/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rockets: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as RocketQueryResponse;
  return data.docs;
}

export async function fetchRocketById(id: string): Promise<Rocket> {
  const response = await fetch(`${BASE_URL}/rockets/${id}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rocket: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as Rocket;
  return data;
}
