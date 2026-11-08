/** Runtime configuration, read once from Vite env variables. */

const DEFAULT_API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)
  .replace(/\/+$/, '')

export const API_TIMEOUT_MS = 10_000

export const APP_NAME = 'Rocket Explorer'
