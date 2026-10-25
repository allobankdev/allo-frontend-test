const API_URL = 'https://lldev.thespacedevs.com/2.2.0'

export interface Rocket {
  id: string | number
  name?: string
  full_name?: string
  description?: string
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  manufacturer?: { name?: string; country_code?: string }
  isLocal?: boolean
}

const request = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export const getSpaceXLaunchers = async () => {
  const params = new URLSearchParams({
    'manufacturer__name': 'SpaceX',
    mode: 'detailed',
    limit: '20',
  })

  return request(
    `${API_URL}/config/launcher/?${params.toString()}`
  )
}