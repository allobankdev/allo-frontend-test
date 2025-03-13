export interface Rocket {
    id: string;
    name: string;
    description: string;
    flickr_images: string[];
    cost_per_launch: string;
    country: string;
    show:boolean;
    first_flight: string;
  }

  export interface Rockets {
    id: string;
    name: string;
    description: string;
    flickr_images: string[];
    show:boolean;
    cost_per_launch: string;
    country:string;
    first_flight:string;
  }