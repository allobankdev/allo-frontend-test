export type Rocket = {
  id: string;
  name: string;
  rocket: string;
  links: {
    patch: {
      small: string;
    }
  }
  flickr?: {
    original: string[];
  };
  details?: string;
  date_local: Date;
};
