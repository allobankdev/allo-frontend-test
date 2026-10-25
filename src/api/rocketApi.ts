import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

interface RocketListResponse {
  results: Rocket[]
}

export async function fetchRocketList(): Promise<Rocket[]> {
  const { data } = await axios.get<RocketListResponse>(
    `${BASE_URL}/config/launcher/`,
    {
      params: {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
      },
    },
  )
  
  return data.results.map((r) => ({ ...r, id: String(r.id) }))
}
