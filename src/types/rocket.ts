
export interface IRocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[]; 
  cost_per_launch: number;
  first_flight: string;
  country: string;
}

export interface IRocketList{
  id: string;
  name: string;
  description: string;
  flickr_images: string;
}
