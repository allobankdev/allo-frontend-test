import axios from 'axios'

// Centralized API client instance
const apiClient = axios.create({
  baseURL: 'https://api.spacexdata.com/v4/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor placeholder
apiClient.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor placeholder
apiClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default apiClient
