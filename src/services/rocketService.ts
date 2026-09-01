import type { Rocket, RocketListResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const rocketService = {
  /**
   * Get all SpaceX rockets
   */
  async getAllRockets(): Promise<Rocket[]> {
    const response = await fetch(
      `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rockets: ${response.statusText}`)
    }
    
    const data: RocketListResponse = await response.json()
    return data.results
  },

  /**
   * Get single rocket by ID
   */
  async getRocketById(id: number): Promise<Rocket> {
    const response = await fetch(
      `${BASE_URL}/config/launcher/${id}/`
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rocket: ${response.statusText}`)
    }
    
    return response.json()
  }
}
