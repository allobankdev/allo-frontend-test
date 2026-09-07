import axios from 'axios'
import type { RocketListResponse, Rocket } from '@/types/rocket'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lldev.thespacedevs.com/2.2.0'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const rocketApi = {
  /**
   * Get all SpaceX rockets
   */
  async getRockets(): Promise<Rocket[]> {
    const response = await api.get<RocketListResponse>(
      '/config/launcher/',
      {
        params: {
          manufacturer__name: 'SpaceX',
          mode: 'detailed',
          limit: 20,
        },
      }
    )
    return response.data.results
  },

  /**
   * Get single rocket by ID
   */
  async getRocketById(id: number): Promise<Rocket> {
    const response = await api.get<Rocket>(
      `/config/launcher/${id}/`,
      {
        params: {
          mode: 'detailed',
        },
      }
    )
    return response.data
  },
}

export default api
