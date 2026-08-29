import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const api = axios.create({
  baseURL: 'https://api.spacexdata.com/latest',
  timeout: 10000,
})

export const getRockets = () => {
  return api.get<Rocket[]>('/rockets')
}

export const getRocketById = (id: string) => {
  return api.get<Rocket>(`/rockets/${id}`)
}
