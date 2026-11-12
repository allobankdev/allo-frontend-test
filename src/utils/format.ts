/** Teks pengganti untuk data rocket yang tidak tersedia dari API. */
export const NOT_AVAILABLE = 'Tidak tersedia'

const costFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

// timeZone UTC agar tanggal tidak bergeser sehari di zona waktu negatif.
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

/**
 * Memformat biaya per peluncuran dalam USD, misalnya `US$52.000.000`.
 *
 * @param cost - Biaya dalam USD, atau `null` jika tidak diketahui.
 * @returns Biaya terformat atau teks `Tidak tersedia`.
 */
export function formatLaunchCost (cost: number | null): string {
  return cost === null ? NOT_AVAILABLE : costFormatter.format(cost)
}

/**
 * Memformat tanggal terbang perdana, misalnya `11 Mei 2018`.
 *
 * @param date - Tanggal format `YYYY-MM-DD`, atau `null`.
 * @returns Tanggal terformat atau teks `Tidak tersedia` jika kosong atau tidak valid.
 */
export function formatMaidenFlight (date: string | null): string {
  if (date === null) return NOT_AVAILABLE
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isNaN(parsed.getTime()) ? NOT_AVAILABLE : dateFormatter.format(parsed)
}

/**
 * Menampilkan kode negara manufaktur apa adanya (API memakai kode tiga huruf, misalnya `USA`).
 *
 * @param countryCode - Kode negara, atau `null`.
 * @returns Kode negara atau teks `Tidak tersedia`.
 */
export function formatCountry (countryCode: string | null): string {
  return countryCode ?? NOT_AVAILABLE
}
