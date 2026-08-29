/**
 * SpaceX API service
 * Documentation: https://github.com/r-spacex/SpaceX-API
 */

import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

export class SpaceXApiService {
  /**
   * Fetch all rockets from SpaceX API
   */
  async getRockets(): Promise<Rocket[]> {
    const response = await fetch(`${API_BASE_URL}/rockets`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rockets: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Transform API response to our Rocket type
    return data.map((rocket: any) => ({
      id: rocket.id,
      name: rocket.name,
      description: rocket.description,
      flickr_images: rocket.flickr_images || [],
      cost_per_launch: rocket.cost_per_launch || 0,
      country: rocket.country || 'Unknown',
      first_flight: rocket.first_flight || 'Unknown',
      active: rocket.active,
      company: rocket.company,
      diameter: rocket.diameter,
      height: rocket.height,
      mass: rocket.mass,
    }))
  }

  /**
   * Fetch a single rocket by ID
   */
  async getRocketById(id: string): Promise<Rocket> {
    const response = await fetch(`${API_BASE_URL}/rockets/${id}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rocket: ${response.statusText}`)
    }
    
    const rocket = await response.json()
    
    return {
      id: rocket.id,
      name: rocket.name,
      description: rocket.description,
      flickr_images: rocket.flickr_images || [],
      cost_per_launch: rocket.cost_per_launch || 0,
      country: rocket.country || 'Unknown',
      first_flight: rocket.first_flight || 'Unknown',
      active: rocket.active,
      company: rocket.company,
      diameter: rocket.diameter,
      height: rocket.height,
      mass: rocket.mass,
    }
  }
}

export const spaceXApiService = new SpaceXApiService()

