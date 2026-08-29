export type TRocket = {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
};

export type TResponseRocket = {
  docs: TRocket[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};
