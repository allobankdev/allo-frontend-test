import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const rocketService = {
  async getAllRockets(): Promise<Rocket[]> {
    try {
      const response = await apiClient.get<Rocket[]>('/rockets')
      return response.data
    } catch (error) {
      console.error('Error fetching rockets:', error)
      throw error
    }
  },

  async getRocketById(id: string): Promise<Rocket> {
    try {
      const response = await apiClient.get<Rocket>(`/rockets/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching rocket ${id}:`, error)
      throw error
    }
  },
  async createRocket(rocket: Rocket): Promise<Rocket> {
    try {
      const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      return {
        ...rocket,
        id: localId,
        rocket_id: localId,
      }
    } catch (error) {
      console.error('Error creating rocket:', error)
      throw error
    }
  },

  searchRockets(rockets: Rocket[], query: string): Rocket[] {
    if (!query.trim()) return rockets

    return rockets.filter((rocket) =>
      rocket.name.toLowerCase().includes(query.toLowerCase()) ||
      rocket.description?.toLowerCase().includes(query.toLowerCase()),
    )
  },
}
