import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://lldev.thespacedevs.com/2.2.0',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})
