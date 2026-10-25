import { API_CONFIG } from "@/constants/config"
import type { Rocket } from "@/types/rocket"

export const rocketApi = {
  async getRockets(): Promise<Rocket[]> {
    const url = `${API_CONFIG.BASE_URL}/?manufacturer__name=${API_CONFIG.MANUFACTURER}&mode=${API_CONFIG.MODE}&limit=${API_CONFIG.LIMIT}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Gagal memuat daftar roket dari API.')

    const data = await res.json()
    return data.results || []
  },

  async getRocketById(id: string | number): Promise<Rocket> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/${id}/`)
    if (!res.ok) throw new Error('Detail roket tidak ditemukan.')

    return await res.json()
  }
}
