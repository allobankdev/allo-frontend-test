const SPACEX_API_BASE = 'https://api.spacexdata.com/v4'

export interface RocketData {
  id: string
  name: string
  type: string
  description: string
  cost_per_launch: number
  country: string
  first_flight: string
  rocket_id: string
  flickr_images: string[]
}

export async function fetchRockets(): Promise<RocketData[]> {
  try {
    const response = await fetch(`${SPACEX_API_BASE}/rockets`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`Failed to fetch rockets: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function fetchRocketById(id: string): Promise<RocketData> {
  try {
    const response = await fetch(`${SPACEX_API_BASE}/rockets/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`Failed to fetch rocket: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
