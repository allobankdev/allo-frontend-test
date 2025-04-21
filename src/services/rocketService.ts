import axios from 'axios'
import type { Rocket } from '@/types/Rocket'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchRockets = async (): Promise<Rocket[]> => {
  const { data } = await axios.get(API_BASE_URL)
  return data
}

export const fetchRocketById = async (id: string): Promise<Rocket> => {
  const { data } = await axios.get(`${API_BASE_URL}/${id}`)
  return data
}   
