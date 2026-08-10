import axios from 'axios'

// Centralized API client instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Normalize API errors globally
apiClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  // Extract readable error message
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred'
  return Promise.reject(new Error(message))
})

export default apiClient
