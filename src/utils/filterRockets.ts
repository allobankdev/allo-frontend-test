import type { Rocket } from '@/types/rocket'

/**
 * Menyaring rocket berdasarkan kata kunci pada nama dan deskripsi.
 * Pencarian tidak peka huruf besar/kecil. Kata kunci kosong mengembalikan semua rocket.
 *
 * @param rockets - Daftar rocket sumber.
 * @param query - Kata kunci dari input filter.
 * @returns Rocket yang cocok, urutan tetap sama.
 */
export function filterRockets (rockets: readonly Rocket[], query: string): Rocket[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return [...rockets]

  return rockets.filter(rocket =>
    rocket.name.toLowerCase().includes(keyword)
    || (rocket.description?.toLowerCase().includes(keyword) ?? false),
  )
}
