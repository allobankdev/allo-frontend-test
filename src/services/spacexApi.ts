/**
 * SpaceX API Service
 * Handles all API calls to the SpaceX REST API
 */

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  active?: boolean
  type?: string
}

const API_BASE_URL = 'https://api.spacexdata.com/v4'

/**
 * Fetch all rockets from SpaceX API
 */
export async function fetchRockets(): Promise<Rocket[]> {
  const response = await fetch(`${API_BASE_URL}/rockets`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rockets: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Fetch a single rocket by ID from SpaceX API
 */
export async function fetchRocketById(id: string): Promise<Rocket> {
  const response = await fetch(`${API_BASE_URL}/rockets/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rocket: ${response.statusText}`)
  }
  
  return response.json()
}

