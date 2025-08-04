export interface RocketResponse {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
}

export interface RocketDetail {
  id: string;
  description: string;
  name: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
}
