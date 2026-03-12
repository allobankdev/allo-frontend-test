import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const api = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
})

export async function getRockets(): Promise<Rocket[]> {
  const { data } = await api.get<Rocket[]>('/rockets')
  return data
}

export async function getRocketById(id: string): Promise<Rocket> {
  const { data } = await api.get<Rocket>(`/rockets/${id}`)
  return data
}
