import axios from 'axios'

// Using development API endpoint as specified in requirements for more generous rate limits
export const apiClient = axios.create({
  baseURL: 'https://lldev.thespacedevs.com/2.2.0',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
})

// Add response error interceptor for clear error messaging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred while fetching rocket data.'

    if (error.response) {
      if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a few moments and try again.'
      } else if (error.response.status === 404) {
        errorMessage = 'Rocket data not found.'
      } else {
        errorMessage = `Server error (${error.response.status}): ${error.response.statusText || 'Unknown error'}`
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection and try again.'
    } else {
      errorMessage = error.message || errorMessage
    }

    return Promise.reject(new Error(errorMessage))
  }
)

export default apiClient
