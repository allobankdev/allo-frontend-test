export interface Rocket {
  id: string;
  name: string;
  description: string;
  country?: string;
  cost_per_launch?: number;
  first_flight?: string;
  flickr_images: string[];
  isLocal?: boolean;
}
