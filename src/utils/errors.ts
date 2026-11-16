/**
 * utils/errors.ts
 *
 * Turns unknown thrown values into messages that are safe to show in the UI.
 */

// Utilities
import axios from 'axios'

export function getApiErrorMessage (error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.'
    }

    if (error.response) {
      return `The server responded with status ${error.response.status}. Please try again.`
    }

    if (error.request) {
      return 'Unable to reach the server. Check your connection and try again.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while loading the data. Please try again.'
}
