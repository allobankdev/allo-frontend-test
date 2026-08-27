/**
 * Interface data model untuk roket SpaceX dan respon API
 */

// Tipe data produsen / pembuat roket (SpaceX)
export interface RocketManufacturer {
  id?: number;
  name?: string;
  country_code?: string;
}

// Tipe data utama untuk 1 objek Roket
export interface Rocket {
  id: number | string;
  name?: string;
  full_name: string;
  description?: string | null;
  image_url?: string | null;
  launch_cost?: string | number | null;
  maiden_flight?: string | null;
  manufacturer?: RocketManufacturer | null;
  is_custom?: boolean; // Penanda jika roket ditambahkan oleh pengguna
}

// Response dari SpaceX Launch Library 2 API (/config/launcher)
export interface SpaceXApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rocket[];
}
