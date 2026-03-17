import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
})

export const fetchRockets = async (): Promise<Rocket[]> => {
  const response = await api.get<Rocket[]>('/rockets')
  return response.data
}

export const fetchRocketById = async (id: string): Promise<Rocket> => {
  const response = await api.get<Rocket>(`/rockets/${id}`)
  return response.data
}