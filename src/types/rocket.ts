export interface Rocket {
  id: string;
  name: string;
  description: string;
  country: string;
  company: string;
  cost_per_launch: number;
  first_flight?: string;
  active: boolean;
  flickr_images: string[];

  first_stage: {
    reusable: boolean;
  };

  height: {
    meters: number;
    feet: number;
  };

  mass: {
    kg: number;
    lb: number;
  };

  isLocal?: boolean;
}

