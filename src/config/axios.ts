import axios, { AxiosError, type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.spacexdata.com',
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const msg = err.response
      ? `HTTP ${err.response.status}`
      : err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

export default api
