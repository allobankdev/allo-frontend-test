export type UiStatus = 'idle' | 'loading' | 'success' | 'error'

export interface Rocket {
  id: string
  name: string
  description: string
  image: string | null
  images: string[]
  costPerLaunch: number
  country: string
  firstFlight: string
}

