import type { Rocket } from '@/types'

const BASE_URL = 'https://api.spacexdata.com/v4'

export const spacexApi = {
  async getAllRockets(): Promise<Rocket[]> {
    const response = await fetch(`${BASE_URL}/rockets`)
    if (!response.ok) {
      throw new Error(`Failed to fetch rockets: ${response.statusText}`)
    }
    return response.json()
  },

  async getRocketById(id: string): Promise<Rocket> {
    const response = await fetch(`${BASE_URL}/rockets/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch rocket: ${response.statusText}`)
    }
    return response.json()
  }
}
