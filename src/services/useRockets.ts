import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const API_URL = import.meta.env.VITE_SPACEX_API_URL || 'https://api.spacexdata.com/v4'

const fetchRockets = async (): Promise<Rocket[]> => {
  const { data } = await axios.get(`${API_URL}/rockets`)
  return data
}

const fetchRocketById = async (id: string): Promise<Rocket> => {
  const { data } = await axios.get(`${API_URL}/rockets/${id}`)
  return data
}

export const useGetRockets = () => {
  return useQuery({
    queryKey: ['rockets'],
    queryFn: fetchRockets,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useGetRocket = (id: string) => {
  return useQuery({
    queryKey: ['rocket', id],
    queryFn: () => fetchRocketById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  })
}
