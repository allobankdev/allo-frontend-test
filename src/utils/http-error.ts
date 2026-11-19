import axios from 'axios'

export function isRequestCanceled (err: unknown): boolean {
  return axios.isCancel(err) || (err as { code?: string })?.code === 'ERR_CANCELED'
}

export function getErrorMessage (err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    if (status === 404) return 'Rocket not found'
    if (err.message) return err.message
  }

  if (err instanceof Error && err.message) return err.message
  return fallback
}

export function isNotFoundError (err: unknown): boolean {
  return axios.isAxiosError(err) && err.response?.status === 404
}
