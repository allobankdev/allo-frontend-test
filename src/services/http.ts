/**
 * services/http.ts
 *
 * Shared Axios instance for every API request.
 */

// Utilities
import axios from 'axios'

// The dev host serves the same data with a much more generous rate limit.
// Override it with VITE_API_BASE_URL when pointing to another environment.
const DEFAULT_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

export default http
