import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4/rockets'

export const rocketApi = {
  async getRockets(): Promise<Rocket[]> {
    const response = await axios.get(`${API_BASE_URL}`)
    return response.data
  },

  async getRocketById(id: string): Promise<Rocket> {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  },
}
