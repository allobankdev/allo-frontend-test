export interface Rocket {
  id: number | string;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer?: { country_code?: string | null } | null;
}

export interface RocketForm {
  full_name: string;
  description: string;
  image_url: string;
  launch_cost: string; // form pakai string; kosong = ""
  maiden_flight: string; // format "YYYY-MM-DD" atau ""
  country_code: string;
}
