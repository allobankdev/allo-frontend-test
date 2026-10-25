import axios from 'axios'
import { mapRawRocket, type RawRocketListResponse, type Rocket } from '@/types/rocket'

const httpClient = axios.create({
  baseURL: 'https://lldev.thespacedevs.com/2.2.0',
})

export async function fetchSpaceXRockets(): Promise<Rocket[]> {
  const { data } = await httpClient.get<RawRocketListResponse>('/config/launcher/', {
    params: { manufacturer__name: 'SpaceX', mode: 'detailed', limit: 20 },
  })
  return data.results.map(mapRawRocket)
}