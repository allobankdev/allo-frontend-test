import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_SPACEX_BASE_URL,
  timeout: 10000
})
