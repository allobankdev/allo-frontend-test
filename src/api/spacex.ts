export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

export async function fetchRockets(): Promise<Rocket[]> {
  const res = await fetch('https://api.spacexdata.com/v4/rockets')
  if (!res.ok) {
    throw new Error('Failed to fetch rockets')
  }
  return res.json()
}
