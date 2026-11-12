import { ApiError } from '@/services/rocketApi'

/**
 * Mengubah error dari pengambilan data menjadi pesan yang bisa ditampilkan ke pengguna.
 *
 * @param error - Error apa pun yang tertangkap di `catch`.
 * @returns Pesan error dalam bahasa Indonesia.
 */
export function getErrorMessage (error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) return 'Rocket tidak ditemukan.'
    if (error.status === 429) return 'Batas request API tercapai. Coba lagi beberapa saat lagi.'
    return `Server sedang bermasalah (HTTP ${error.status}).`
  }
  // `response.json()` melempar SyntaxError jika server membalas data yang bukan JSON.
  if (error instanceof SyntaxError) return 'Data dari server tidak valid. Coba lagi beberapa saat lagi.'
  return 'Gagal terhubung ke server. Periksa koneksi internet kamu.'
}
