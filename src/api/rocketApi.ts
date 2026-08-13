import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
})

export const getRockets = async () => {
  const response = await api.get('/rockets')
  return response.data
}

export const getRocketById = async (id: string) => {
  const response = await api.get(`/rockets/${id}`)
  return response.data
}
