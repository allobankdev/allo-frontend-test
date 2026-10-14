
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lldev.thespacedevs.com/2.2.0/',
  timeout: 15000,
})

export interface Launcher {
  id: number
  name: string
  full_name?: string
  description?: string | null
  image_url?: string | null
  launch_cost?: number | null
  maiden_flight?: string | null
  manufacturer?: {
    name?: string
    country_code?: string
  } | null
  isCustom?: boolean
}

interface LauncherResponse {
  count: number
  results: Launcher[]
}

export async function getLaunchers(): Promise<Launcher[]> {
  const response = await api.get<LauncherResponse>(
    'config/launcher/',
    {
      params: {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: 20,
      },
    },
  )

  return response.data.results
}

export async function getLauncherById(
  id: number | string,
): Promise<Launcher> {
  const response = await api.get<Launcher>(
    `config/launcher/${id}/`,
    {
      params: {
        mode: 'detailed',
      },
    },
  )

  return response.data
}
