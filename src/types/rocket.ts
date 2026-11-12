/**
 * Model rocket yang dipakai di seluruh aplikasi.
 * Field yang bisa kosong dari API bernilai `null`, bukan string kosong.
 */
export interface Rocket {
  /** Id unik dalam bentuk string agar seragam untuk parameter route. */
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** Biaya per peluncuran dalam USD. */
  launchCost: number | null
  /** Kode negara manufaktur, misalnya `USA`. */
  countryCode: string | null
  /** Tanggal terbang perdana, format `YYYY-MM-DD`. */
  maidenFlight: string | null
}
