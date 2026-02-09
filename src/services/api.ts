import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const rocketApi = {
  // Ambil Semua Data Rocket
  async getAllRockets(): Promise<Rocket[]> {
    const response = await apiClient.get<Rocket[]>('/rockets')
    return response.data
  },

  // Ambil Rocket berdasarkan ID
  async getRocketById(id: string): Promise<Rocket> {
    const response = await apiClient.get<Rocket>(`/rockets/${id}`)
    return response.data
  },

  async addRocket(rocket: Partial<Rocket>): Promise<Rocket> {
    // Call Api
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Buat Objek Rocket Baru
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: rocket.name || '',
      description: rocket.description || '',
      flickr_images: rocket.flickr_images || [],
      cost_per_launch: rocket.cost_per_launch || 0,
      country: rocket.country || '',
      first_flight: rocket.first_flight || new Date().toISOString().split('T')[0],
      active: true,
      company: 'Custom',
      wikipedia: '',
      height: { meters: 0, feet: 0 },
      diameter: { meters: 0, feet: 0 },
      mass: { kg: 0, lb: 0 },
      success_rate_pct: 0,
    }

    return newRocket
  },
}
