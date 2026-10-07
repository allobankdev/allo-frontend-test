import axios from "axios"
import type { Rocket } from "./types"

const BASE_URL = 'https://api.spacexdata.com/v4'

const api = axios.create({baseURL: BASE_URL})

export const getRockets = async (): Promise<Rocket[]> => {
  const res = await api.get<Rocket[]>(`/rockets`)
  return res.data
}

export const getRocketById = async (id: string): Promise<Rocket> => {
  const res = await api.get<Rocket>(`/rockets/${id}`)
  return res.data
}
