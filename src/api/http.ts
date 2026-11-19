import axios from 'axios'

export const API_BASE_URL = 'https://lldev.thespacedevs.com'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
  },
})
