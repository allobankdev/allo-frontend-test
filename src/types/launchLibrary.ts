/**
 * Tipe respons Launch Library 2 API v2.2.0.
 * Hanya field yang dipakai aplikasi yang didefinisikan.
 */

/** Data manufaktur rocket di dalam objek launcher. */
export interface LauncherManufacturerDto {
  country_code: string | null
}

/** Satu konfigurasi launcher dari endpoint `/config/launcher/` (mode detailed). */
export interface LauncherConfigDto {
  id: number
  full_name: string
  description: string | null
  image_url: string | null
  /** Biaya per peluncuran dalam USD, dikirim API sebagai string angka. */
  launch_cost: string | null
  /** Tanggal terbang perdana, format `YYYY-MM-DD`. */
  maiden_flight: string | null
  manufacturer: LauncherManufacturerDto | null
}

/** Bungkus respons list berhalaman dari Launch Library 2. */
export interface PaginatedResponseDto<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
