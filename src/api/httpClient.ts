import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lldev.thespacedevs.com/2.2.0',
  timeout: 15000,
})

export default httpClient
